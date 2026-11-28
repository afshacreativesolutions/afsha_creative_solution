import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, Clock, Sparkles, User } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import TrackedActionLink from "@/components/lead/TrackedActionLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { getPublicBlogPost, getPublicBlogPosts } from "@/lib/catalog";
import { getPublishedCmsSiteSettings } from "@/lib/cms/queries";
import { getStaticBlogPost, STATIC_BLOG_POSTS, type StaticBlogPost } from "@/lib/blog-data";
import { absoluteUrl } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type BlogPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getPublicBlogPost(slug)) || getStaticBlogPost(slug);
  if (!post) {
    return { title: "Article Not Found | Afsha Creative Solutions" };
  }

  const title = post.seo_title || `${post.title} | Afsha Creative Solutions`;
  const description =
    post.seo_description ||
    post.excerpt ||
    post.content.slice(0, 160).replace(/[#*`\n]/g, " ");

  const canonical = post.canonical_url || `/blog/${post.slug}`;
  const ogImage = `https://www.afshacreative.in/blog/${post.slug}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      locale: "en_IN",
      siteName: "Afsha Creative Solution",
      title,
      description,
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const dbPost = await getPublicBlogPost(slug);
  const staticPost = getStaticBlogPost(slug);

  if (!dbPost && !staticPost) {
    notFound();
  }

  const post: StaticBlogPost = {
    ...(staticPost || {
      id: dbPost!.id,
      title: dbPost!.title,
      slug: dbPost!.slug,
      excerpt: dbPost!.excerpt,
      content: dbPost!.content,
      featured_image: dbPost!.featured_image,
      image_alt: dbPost!.image_alt,
      seo_title: dbPost!.seo_title,
      seo_description: dbPost!.seo_description,
      focus_keyword: dbPost!.focus_keyword,
      canonical_url: dbPost!.canonical_url,
      status: dbPost!.status,
      published_at: dbPost!.published_at,
      category: "Architectural Metalwork",
      readTime: "5 min read",
      author: "Afsha Creative Solutions Team",
    }),
    ...(dbPost
      ? {
          title: dbPost.title,
          excerpt: dbPost.excerpt || staticPost?.excerpt || null,
          content: dbPost.content || staticPost?.content || "",
          featured_image: dbPost.featured_image || staticPost?.featured_image || null,
        }
      : {}),
  };

  // Related articles (exclude current)
  const [allPosts, siteSettings] = await Promise.all([
    getPublicBlogPosts(),
    getPublishedCmsSiteSettings(),
  ]);
  const tpl = siteSettings.template_defaults.blogDetail;
  const mergedRelatedPool: StaticBlogPost[] = [
    ...STATIC_BLOG_POSTS,
    ...allPosts
      .filter((p) => !STATIC_BLOG_POSTS.some((sp) => sp.slug === p.slug))
      .map((p) => ({
        ...p,
        category: "Architectural Metalwork",
        readTime: "5 min read",
        author: siteSettings.site_identity.siteLegalName,
      })),
  ];
  const relatedPosts = mergedRelatedPool.filter((p) => p.slug !== post.slug).slice(0, 3);

  const imageSrc = post.staticImage || post.featured_image || "/videos/hero-poster.webp";
  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-IN", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "March 2026";

  // Parse markdown-like content blocks (sections starting with ### or paragraphs)
  const contentSections = post.content.split(/\n\n+/).filter(Boolean);

  return (
    <main className="bg-background text-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.seo_description || post.excerpt || undefined,
          image: typeof imageSrc === "string" ? absoluteUrl(imageSrc) : undefined,
          datePublished: post.published_at || undefined,
          dateModified: post.updated_at || post.published_at || undefined,
          author: {
            "@type": "Organization",
            name: "Afsha Creative Solutions",
            url: absoluteUrl("/"),
          },
          publisher: {
            "@type": "Organization",
            name: "Afsha Creative Solutions",
            url: absoluteUrl("/"),
          },
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
        }}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />

      <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Category & Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50 transition hover:text-textGold"
          >
            <ArrowLeft size={14} /> {tpl.backLabel}
          </Link>
          <span className="rounded-full bg-textGold/10 border border-textGold/30 px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-textGold">
            {post.category}
          </span>
        </div>

        {/* H1 Heading */}
        <h1 className="text-[clamp(2.1rem,5vw,3.75rem)] font-light leading-[1.1] tracking-tight text-white">
          {post.title}
        </h1>

        {/* Meta details */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-white/10 py-4 text-xs text-white/50 sm:gap-6">
          <div className="flex items-center gap-2">
            <User size={14} className="text-textGold" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-textGold" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-textGold" />
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mt-6 text-base leading-8 text-white/75 sm:text-lg sm:leading-8">
            {post.excerpt}
          </p>
        )}

        {/* Featured Image */}
        <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#111] sm:mt-10 sm:aspect-[16/9]">
          <Image
            src={imageSrc}
            alt={post.image_alt || post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="mt-10 space-y-6 sm:mt-12 sm:space-y-8">
          {contentSections.map((block, index) => {
            if (block.startsWith("### ")) {
              const headingText = block.replace("### ", "");
              return (
                <div key={index} className="pt-4">
                  <h2 className="text-xl font-light text-textGold sm:text-2xl">
                    {headingText}
                  </h2>
                  <div className="mt-2 h-0.5 w-10 bg-textGold/30" />
                </div>
              );
            }

            if (block.startsWith("## ")) {
              const headingText = block.replace("## ", "");
              return (
                <div key={index} className="pt-6">
                  <h2 className="text-2xl font-light text-white sm:text-3xl">
                    {headingText}
                  </h2>
                  <div className="mt-2 h-0.5 w-12 bg-textGold" />
                </div>
              );
            }

            // Bullet list check
            if (block.includes("\n- ") || block.startsWith("- ")) {
              const lines = block.split("\n");
              return (
                <ul key={index} className="space-y-3 rounded-xl border border-white/5 bg-[#0a0a0a] p-5 sm:p-6">
                  {lines.map((line, lIdx) => {
                    const cleanLine = line.replace(/^- /, "").trim();
                    if (!cleanLine) return null;
                    return (
                      <li key={lIdx} className="flex items-start gap-2.5 text-sm leading-7 text-white/70 sm:text-base">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-textGold" />
                        <span>{cleanLine}</span>
                      </li>
                    );
                  })}
                </ul>
              );
            }

            return (
              <p key={index} className="text-sm leading-8 text-white/65 sm:text-base sm:leading-8">
                {block}
              </p>
            );
          })}
        </div>

        {/* In-article CTA box */}
        <div className="mt-12 rounded-2xl border border-textGold/30 bg-textGold/[0.04] p-6 sm:mt-16 sm:p-10">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-textGold">
            <Sparkles size={14} /> {tpl.ctaEyebrow}
          </div>
          <h3 className="mt-3 text-xl font-light text-white sm:text-2xl">
            {tpl.ctaHeading}
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/65">
            {tpl.ctaDescription}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <TrackedActionLink
              href={buildWhatsAppUrl({
                whatsappNumber: siteSettings.site_identity.whatsappNumber,
                message: `Hello Afsha Creative Solutions! I read your article "${post.title}" and would like to discuss a similar metalwork design.`,
              })}
              eventName="whatsapp_click"
              trackingProps={{
                placement: "blog_article_cta",
                channel: "whatsapp",
                sourcePage: `/blog/${post.slug}`,
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-textGold bg-textGold px-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-white"
            >
              <WhatsAppIcon size={15} /> Enquire on WhatsApp
            </TrackedActionLink>
            <Link
              href="/custom-metalwork"
              className="inline-flex min-h-11 items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/70 transition hover:text-white"
            >
              Request Custom Quote <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-white/10 pt-12 sm:mt-20 sm:pt-16">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-textGold">
                  {tpl.relatedEyebrow}
                </p>
                <h3 className="mt-1 text-2xl font-light text-white">
                  {tpl.relatedHeading}
                </h3>
              </div>
              <Link
                href="/blog"
                className="text-[10px] uppercase tracking-[0.18em] text-white/50 hover:text-textGold"
              >
                View all articles
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#080808] p-5 transition duration-300 hover:border-textGold/40"
                >
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.18em] text-textGold">
                      {related.category}
                    </span>
                    <h4 className="mt-2 line-clamp-2 text-sm font-light text-white group-hover:text-textGold transition-colors">
                      {related.title}
                    </h4>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-[10px] text-white/40 border-t border-white/5 pt-3">
                    <span>{related.readTime}</span>
                    <ArrowRight size={13} className="text-textGold transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <CTASection />
    </main>
  );
}
