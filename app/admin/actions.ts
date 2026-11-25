"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminAction, clearAdminSessionCache } from "@/lib/admin-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UploadedProductImage } from "@/lib/catalog-types";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function listValue(formData: FormData, key: string) {
  return value(formData, key).split("\n").map((item) => item.trim()).filter(Boolean);
}

function parseSpecifications(source: string) {
  const specs: Record<string, string> = {};
  for (const line of source.split("\n")) {
    const separator = line.indexOf(":");
    if (separator > 0) {
      const key = line.slice(0, separator).trim();
      const specValue = line.slice(separator + 1).trim();
      if (key && specValue) specs[key] = specValue;
    }
  }
  return specs;
}

export async function signIn(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/admin/login?error=setup");

  const email = value(formData, "email");
  const password = String(formData.get("password") ?? "");
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !authData.user) redirect("/admin/login?error=invalid");

  const user = authData.user;
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  clearAdminSessionCache();
  redirect("/admin/products");
}

export async function signOut() {
  clearAdminSessionCache();
  const supabase = await createSupabaseServerClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

export async function saveProduct(formData: FormData) {
  const { supabase } = await requireAdminAction();
  const id = value(formData, "id");
  const name = value(formData, "name");
  const slug = value(formData, "slug").toLowerCase();
  const categoryId = value(formData, "category_id");
  const shortDescription = value(formData, "short_description");
  if (!name || !slug || !categoryId || !shortDescription) throw new Error("Name, slug, category, and short description are required.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Use lowercase letters, numbers, and hyphens for the slug.");

  let uploadedImages: UploadedProductImage[];
  try {
    uploadedImages = JSON.parse(value(formData, "images") || "[]") as UploadedProductImage[];
  } catch {
    throw new Error("The image list could not be read. Refresh and try again.");
  }
  if (!Array.isArray(uploadedImages) || uploadedImages.some((image) => !image.storage_path)) throw new Error("One or more images are invalid.");

  const productData = {
    name,
    slug,
    category_id: categoryId,
    short_description: shortDescription,
    description: value(formData, "description"),
    materials: listValue(formData, "materials"),
    applications: listValue(formData, "applications"),
    customization_options: listValue(formData, "customization_options"),
    finish_options: listValue(formData, "finish_options"),
    specifications: parseSpecifications(value(formData, "specifications")),
    care_instructions: value(formData, "care_instructions") || null,
    warranty: value(formData, "warranty") || null,
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
    sort_order: Number.parseInt(value(formData, "sort_order") || "0", 10) || 0,
    seo_title: value(formData, "seo_title") || null,
    seo_description: value(formData, "seo_description") || null,
    focus_keyword: value(formData, "focus_keyword") || null,
    canonical_url: value(formData, "canonical_url") || null,
    image_alt: value(formData, "image_alt") || null,
  };

  const previousImages = id
    ? await supabase.from("product_images").select("storage_path").eq("product_id", id)
    : { data: [] as { storage_path: string }[], error: null };
  if (previousImages.error) throw new Error(previousImages.error.message);

  const saved = id
    ? await supabase.from("products").update(productData).eq("id", id).select("id").single()
    : await supabase.from("products").insert(productData).select("id").single();
  if (saved.error || !saved.data) throw new Error(saved.error?.message || "The product could not be saved.");

  const imageResult = await supabase.rpc("replace_product_images", {
    p_product_id: saved.data.id,
    p_images: uploadedImages.map((image, index) => ({
      storage_path: image.storage_path,
      alt_text: image.alt_text?.trim() || name,
      sort_order: index,
      is_primary: index === 0,
    })),
  });
  if (imageResult.error) throw new Error(imageResult.error.message);

  const retained = new Set(uploadedImages.map((image) => image.storage_path));
  const removedPaths = (previousImages.data ?? []).map((image) => image.storage_path).filter((path) => !retained.has(path));
  if (removedPaths.length) await supabase.storage.from("product-images").remove(removedPaths);

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  if (id) redirect(`/admin/products/${saved.data.id}/edit?saved=1`);
  redirect(`/admin/products/${saved.data.id}/edit?saved=1`);
}

export async function deleteProduct(formData: FormData) {
  const { supabase } = await requireAdminAction();
  const id = value(formData, "id");
  if (!id) throw new Error("Product ID is required.");
  const images = await supabase.from("product_images").select("storage_path").eq("product_id", id);
  if (images.error) throw new Error(images.error.message);
  const deleted = await supabase.from("products").delete().eq("id", id);
  if (deleted.error) throw new Error(deleted.error.message);
  const paths = (images.data ?? []).map((image) => image.storage_path);
  if (paths.length) await supabase.storage.from("product-images").remove(paths);
  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products?deleted=1");
}

export async function saveCategory(formData: FormData) {
  const { supabase } = await requireAdminAction();
  const id = value(formData, "id");
  const name = value(formData, "name");
  const slug = value(formData, "slug").toLowerCase();
  if (!name || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Enter a category name and a valid lowercase slug.");
  const data = {
    name,
    slug,
    description: value(formData, "description") || null,
    sort_order: Number.parseInt(value(formData, "sort_order") || "0", 10) || 0,
    is_active: formData.get("is_active") === "on",
  };
  const result = id
    ? await supabase.from("categories").update(data).eq("id", id)
    : await supabase.from("categories").insert(data);
  if (result.error) throw new Error(result.error.message);
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/categories");
  redirect("/admin/categories?saved=1");
}

export async function setCategoryActive(formData: FormData) {
  const { supabase } = await requireAdminAction();
  const id = value(formData, "id");
  const active = value(formData, "active") === "true";
  if (!id) throw new Error("Category ID is required.");
  const { error } = await supabase.from("categories").update({ is_active: active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/categories");
}

export async function saveBlogPost(formData: FormData) {
  const { supabase } = await requireAdminAction();
  const id = value(formData, "id");
  const title = value(formData, "title");
  const slug = value(formData, "slug").toLowerCase();
  const content = value(formData, "content");
  if (!title || !slug || !content) throw new Error("Title, slug, and content are required.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Use lowercase letters, numbers, and hyphens for the slug.");

  const status = value(formData, "status") === "published" ? "published" : "draft";
  const publishedAtInput = value(formData, "published_at");
  const blogData = {
    title,
    slug,
    excerpt: value(formData, "excerpt") || null,
    content,
    featured_image: value(formData, "featured_image") || null,
    image_alt: value(formData, "image_alt") || null,
    seo_title: value(formData, "seo_title") || null,
    seo_description: value(formData, "seo_description") || null,
    focus_keyword: value(formData, "focus_keyword") || null,
    canonical_url: value(formData, "canonical_url") || null,
    status,
    published_at: publishedAtInput ? new Date(publishedAtInput).toISOString() : (status === "published" ? new Date().toISOString() : null),
  };

  const saved = id
    ? await supabase.from("blog_posts").update(blogData).eq("id", id).select("id").single()
    : await supabase.from("blog_posts").insert(blogData).select("id").single();
  if (saved.error || !saved.data) {
    if (saved.error?.message?.includes("blog_posts") || (saved.error as { code?: string })?.code === "PGRST205") {
      throw new Error("The 'blog_posts' table has not been created in Supabase yet. Please execute 'supabase/migrations/202611240003_seo_blog_and_product_fields.sql' in your Supabase SQL Editor first.");
    }
    throw new Error(saved.error?.message || "The article could not be saved.");
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect(`/admin/blog/${saved.data.id}/edit?saved=1`);
}

export async function deleteBlogPost(formData: FormData) {
  const { supabase } = await requireAdminAction();
  const id = value(formData, "id");
  if (!id) throw new Error("Article ID is required.");
  const deleted = await supabase.from("blog_posts").delete().eq("id", id);
  if (deleted.error) {
    if (deleted.error?.message?.includes("blog_posts") || (deleted.error as { code?: string })?.code === "PGRST205") {
      throw new Error("The 'blog_posts' table has not been created in Supabase yet. Please execute 'supabase/migrations/202611240003_seo_blog_and_product_fields.sql' in your Supabase SQL Editor first.");
    }
    throw new Error(deleted.error.message);
  }
  revalidatePath("/blog");
  redirect("/admin/blog?deleted=1");
}
