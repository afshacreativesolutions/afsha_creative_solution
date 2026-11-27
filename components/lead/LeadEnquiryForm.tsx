"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Camera,
  CheckCircle2,
  LoaderCircle,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { getOrCreateSessionId, getOrCreateVisitorId } from "@/lib/consent-store";
import { ALLOWED_IMAGE_TYPES } from "@/lib/image-security";
import {
  MAX_LEAD_PHOTO_BYTES,
  validateLeadFields,
  type LeadFieldErrors,
} from "@/lib/lead-validation";
import { getAttributionFromUrl, trackEvent } from "@/lib/tracker";
import { useOptionalEnquiry } from "./EnquiryContext";

export type LeadCategoryOption = { slug: string; name: string };

export type LeadEnquiryFormProps = {
  categories?: LeadCategoryOption[];
  defaultCategory?: string;
  productId?: string;
  productSlug?: string;
  productName?: string;
  designCode?: string;
  placement?: string;
  whatsappNumber?: string;
  heading?: string;
  subheading?: string;
  compact?: boolean;
  onSuccess?: () => void;
  className?: string;
};

const CORE_PRODUCT_SERVICES: LeadCategoryOption[] = [
  { slug: "gates", name: "Main Gate (Iron / Steel)" },
  { slug: "sliding-gates", name: "Sliding Gate" },
  { slug: "folding-gates", name: "Folding / Collapsible Gate" },
  { slug: "stair-railings", name: "Staircase Railing" },
  { slug: "balcony-railings", name: "Balcony / Terrace Railing" },
  { slug: "spiral-railings", name: "Spiral Railing" },
  { slug: "steel-doors", name: "Steel Door / Security Door" },
  { slug: "decorative-grills", name: "Window Grill / Metal Partition" },
  { slug: "custom-metalwork", name: "Custom Metal Fabrication" },
];

const QUICK_CITIES = ["Moradabad", "Rampur", "Sambhal", "Amroha", "Bareilly"];

const inputBase =
  "mt-1.5 min-h-[48px] w-full rounded-lg border bg-[#121212] px-3.5 text-base text-white outline-none transition placeholder:text-white/35 sm:text-sm";
const inputNormal = "border-white/15 focus:border-textGold/80 focus:ring-1 focus:ring-textGold/30";
const inputError = "border-red-400/70 focus:border-red-400 focus:ring-1 focus:ring-red-400/40";
const labelClass =
  "block text-[10px] font-medium uppercase tracking-[0.18em] text-white/65";

export default function LeadEnquiryForm({
  categories = [],
  defaultCategory = "",
  productId = "",
  productSlug = "",
  productName = "",
  designCode = "",
  placement = "website",
  whatsappNumber = "919634776691",
  heading,
  subheading,
  compact = false,
  onSuccess,
  className = "",
}: LeadEnquiryFormProps) {
  const pathname = usePathname() || "/";
  const formId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);
  const formStartedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormInteraction = () => {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    void trackEvent("enquiry_form_start", {
      placement,
      category: category || defaultCategory || "general",
      productSlug: productSlug || null,
    });
  };

  const enquiryCtx = useOptionalEnquiry();
  const setEmbeddedFormInView = enquiryCtx?.setEmbeddedFormInView;

  // Merge core fabrication options + dynamic catalog categories cleanly without duplicates
  const mergedOptions: LeadCategoryOption[] = [...CORE_PRODUCT_SERVICES];
  for (const cat of categories) {
    if (cat.slug && !mergedOptions.some((o) => o.slug === cat.slug)) {
      mergedOptions.push({ slug: cat.slug, name: cat.name });
    }
  }
  mergedOptions.push({ slug: "other", name: "Other Architectural Fabrication" });

  const resolvedDefaultCategory =
    defaultCategory && mergedOptions.some((o) => o.slug === defaultCategory)
      ? defaultCategory
      : productName
        ? "custom-metalwork"
        : "";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState(resolvedDefaultCategory);
  const [city, setCity] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [marketingWhatsApp, setMarketingWhatsApp] = useState(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<LeadFieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `sub-${Date.now()}`
  );
  const [confirmation, setConfirmation] = useState<{
    reference: string;
    whatsappUrl: string;
    name: string;
    city: string;
    categoryLabel: string;
  } | null>(null);

  useEffect(() => {
    if (!compact && setEmbeddedFormInView && rootRef.current) {
      const el = rootRef.current;
      const observer = new IntersectionObserver(
        ([entry]) => {
          setEmbeddedFormInView?.(entry.isIntersecting);
        },
        { threshold: 0.15 }
      );
      observer.observe(el);
      return () => {
        setEmbeddedFormInView?.(false);
        observer.unobserve(el);
      };
    }
    return undefined;
  }, [compact, setEmbeddedFormInView]);

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [photoPreviewUrl]);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setFieldErrors((prev) => ({
        ...prev,
        photo: "Please select a JPG, PNG, WebP, or AVIF photo.",
      }));
      e.target.value = "";
      return;
    }

    if (file.size > MAX_LEAD_PHOTO_BYTES) {
      setFieldErrors((prev) => ({
        ...prev,
        photo: "Photo must be under 5 MB.",
      }));
      e.target.value = "";
      return;
    }

    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next.photo;
      return next;
    });
  };

  const clearPhoto = () => {
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    setSubmitError(null);
    const clientValidation = validateLeadFields(
      { name, phone, category, city, email, dimensions, message },
      true
    );

    if (!clientValidation.valid) {
      setFieldErrors(clientValidation.errors);
      void trackEvent("enquiry_form_error", {
        placement,
        category: category || "unset",
        productSlug: productSlug || null,
        errorType: "validation",
      });
      const firstKey = Object.keys(clientValidation.errors)[0];
      const targetEl = rootRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`);
      targetEl?.focus();
      return;
    }

    setFieldErrors({});
    submittingRef.current = true;
    setSubmitting(true);
    void trackEvent("enquiry_form_submit", {
      placement,
      category: clientValidation.data.category,
      productSlug: productSlug || null,
      hasPhoto: Boolean(photoFile),
    });

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();
    const attribution = getAttributionFromUrl();

    try {
      let response: Response;
      if (photoFile) {
        const fd = new FormData();
        fd.append("name", clientValidation.data.name);
        fd.append("phone", clientValidation.data.phone);
        fd.append("category", clientValidation.data.category);
        fd.append("city", clientValidation.data.city);
        if (email) fd.append("email", email);
        if (dimensions) fd.append("dimensions", dimensions);
        if (message) fd.append("message", message);
        if (productId) fd.append("productId", productId);
        if (productSlug) fd.append("productSlug", productSlug);
        if (productName) fd.append("productName", productName);
        if (designCode) fd.append("designCode", designCode);
        fd.append("pageUrl", pathname);
        fd.append("placement", placement);
        fd.append("source", placement === "contact_page" ? "contact_page" : "quote_form");
        if (visitorId) fd.append("visitorId", visitorId);
        if (sessionId) fd.append("sessionId", sessionId);
        fd.append("clientSubmissionId", submissionId);
        fd.append("marketingWhatsApp", String(marketingWhatsApp));
        if (website) fd.append("website", website);
        for (const [k, v] of Object.entries(attribution)) {
          if (v) fd.append(k, String(v));
        }
        fd.append("photo", photoFile);

        response = await fetch("/api/contact", {
          method: "POST",
          body: fd,
        });
      } else {
        response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: clientValidation.data.name,
            phone: clientValidation.data.phone,
            email: clientValidation.data.email,
            category: clientValidation.data.category,
            city: clientValidation.data.city,
            dimensions: clientValidation.data.dimensions,
            message: clientValidation.data.message,
            productId,
            productSlug,
            productName,
            designCode,
            pageUrl: pathname,
            placement,
            source: placement === "contact_page" ? "contact_page" : "quote_form",
            visitorId,
            sessionId,
            clientSubmissionId: submissionId,
            marketingWhatsApp,
            website,
            ...attribution,
          }),
        });
      }

      const json = (await response.json()) as {
        success?: boolean;
        reference?: string;
        whatsappUrl?: string;
        error?: string;
        fieldErrors?: LeadFieldErrors;
      };

      if (!response.ok || !json.reference) {
        if (json.fieldErrors) setFieldErrors(json.fieldErrors);
        throw new Error(json.error || "Could not submit your enquiry. Please try again.");
      }

      const analyticsMeta = {
        category: clientValidation.data.category,
        placement,
        productSlug: productSlug || null,
        hasPhoto: Boolean(photoFile),
      };
      void trackEvent("quote_form_submit", analyticsMeta);
      void trackEvent("enquiry_form_success", analyticsMeta);

      const chosenLabel =
        productName ||
        mergedOptions.find((o) => o.slug === clientValidation.data.category)?.name ||
        clientValidation.data.category;

      const cleanDigits = whatsappNumber.replace(/\D/g, "") || "919634776691";
      const fallbackWa = `https://wa.me/${cleanDigits}?text=${encodeURIComponent(
        `Hello Afsha Creative Solution, my enquiry reference is ${json.reference} for ${chosenLabel} in ${clientValidation.data.city}.`
      )}`;

      setConfirmation({
        reference: json.reference,
        whatsappUrl: json.whatsappUrl || fallbackWa,
        name: clientValidation.data.name,
        city: clientValidation.data.city,
        categoryLabel: chosenLabel,
      });

      // Reset form inputs ONLY on confirmed success
      setName("");
      setPhone("");
      setCity("");
      setDimensions("");
      setMessage("");
      setEmail("");
      setMarketingWhatsApp(false);
      clearPhoto();
      setSubmissionId(
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `sub-${Date.now()}`
      );
      onSuccess?.();
    } catch (err) {
      void trackEvent("enquiry_form_error", {
        placement,
        category: clientValidation.data.category,
        productSlug: productSlug || null,
        errorType: "submission_failed",
      });
      // Recoverable error preserves all entered field values automatically
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Network issue while sending. Your inputs were kept safely — please try again."
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <div
      ref={rootRef}
      className={`rounded-2xl border border-white/12 bg-[#080808] ${
        compact ? "p-4 sm:p-6" : "p-5 sm:p-8 lg:p-10"
      } ${className}`}
    >
      {(heading || subheading) && (
        <div className="mb-5 sm:mb-7">
          {heading && (
            <h2 className="text-xl font-light leading-snug text-white sm:text-3xl">{heading}</h2>
          )}
          {subheading && (
            <p className="mt-2 text-sm leading-6 text-white/60">{subheading}</p>
          )}
        </div>
      )}

      {confirmation ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-emerald-500/35 bg-emerald-950/25 p-5 text-center sm:p-8"
        >
          <CheckCircle2 size={40} className="mx-auto text-emerald-400" />
          <h3 className="mt-3 text-xl font-light text-white">
            Thank You, {confirmation.name}
          </h3>
          <p className="mt-1.5 text-xs uppercase tracking-[0.18em] text-textGold">
            Enquiry Ref: {confirmation.reference}
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/75">
            Your enquiry for <strong>{confirmation.categoryLabel}</strong> in{" "}
            <strong>{confirmation.city}</strong> has been received. Our fabrication team will
            reach out shortly with guidance and pricing.
          </p>

          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={confirmation.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                void trackEvent("whatsapp_click", {
                  placement: "enquiry_confirmation",
                  category: confirmation.categoryLabel,
                  productSlug: productSlug || null,
                });
              }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-textGold bg-textGold px-6 text-xs font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-white"
            >
              <MessageCircle size={16} /> Chat Now on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setConfirmation(null)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 text-xs text-white/70 transition hover:border-white/35 hover:text-white"
            >
              Send Another Enquiry
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          onFocusCapture={handleFormInteraction}
          noValidate
          className="space-y-4 sm:space-y-5"
        >
          {productName && (
            <div className="rounded-lg border border-textGold/30 bg-textGold/[0.06] px-3.5 py-2.5 text-xs text-textGold">
              Enquiring about: <strong>{productName}</strong>
              {designCode ? ` (Design ${designCode})` : ""}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${formId}-name`} className={labelClass}>
                Your Name *
              </label>
              <input
                id={`${formId}-name`}
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
                }}
                placeholder="e.g. Rajesh Kumar"
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? `${formId}-name-err` : undefined}
                className={`${inputBase} ${fieldErrors.name ? inputError : inputNormal}`}
              />
              {fieldErrors.name && (
                <p id={`${formId}-name-err`} className="mt-1.5 text-xs text-red-300">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`${formId}-phone`} className={labelClass}>
                Mobile / WhatsApp Number *
              </label>
              <input
                id={`${formId}-phone`}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
                }}
                placeholder="e.g. +91 98765 43210"
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-describedby={fieldErrors.phone ? `${formId}-phone-err` : undefined}
                className={`${inputBase} ${fieldErrors.phone ? inputError : inputNormal}`}
              />
              {fieldErrors.phone && (
                <p id={`${formId}-phone-err`} className="mt-1.5 text-xs text-red-300">
                  {fieldErrors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${formId}-category`} className={labelClass}>
                Product / Service Required *
              </label>
              <select
                id={`${formId}-category`}
                name="category"
                required
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (fieldErrors.category)
                    setFieldErrors((p) => ({ ...p, category: undefined }));
                }}
                aria-invalid={Boolean(fieldErrors.category)}
                aria-describedby={fieldErrors.category ? `${formId}-cat-err` : undefined}
                className={`${inputBase} cursor-pointer ${
                  fieldErrors.category ? inputError : inputNormal
                }`}
              >
                <option value="" disabled>
                  Select gate, railing, or fabrication...
                </option>
                {mergedOptions.map((opt) => (
                  <option key={opt.slug} value={opt.slug} className="bg-[#121212] text-white">
                    {opt.name}
                  </option>
                ))}
              </select>
              {fieldErrors.category && (
                <p id={`${formId}-cat-err`} className="mt-1.5 text-xs text-red-300">
                  {fieldErrors.category}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`${formId}-city`} className={labelClass}>
                City / Site Location *
              </label>
              <input
                id={`${formId}-city`}
                name="city"
                type="text"
                autoComplete="address-level2"
                required
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (fieldErrors.city) setFieldErrors((p) => ({ ...p, city: undefined }));
                }}
                placeholder="e.g. Moradabad, UP"
                aria-invalid={Boolean(fieldErrors.city)}
                aria-describedby={fieldErrors.city ? `${formId}-city-err` : undefined}
                className={`${inputBase} ${fieldErrors.city ? inputError : inputNormal}`}
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {QUICK_CITIES.map((suggested) => (
                  <button
                    key={suggested}
                    type="button"
                    onClick={() => {
                      setCity(suggested);
                      if (fieldErrors.city) setFieldErrors((p) => ({ ...p, city: undefined }));
                    }}
                    className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                      city.toLowerCase() === suggested.toLowerCase()
                        ? "border-textGold bg-textGold/20 text-textGold"
                        : "border-white/10 text-white/55 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {suggested}
                  </button>
                ))}
              </div>
              {fieldErrors.city && (
                <p id={`${formId}-city-err`} className="mt-1.5 text-xs text-red-300">
                  {fieldErrors.city}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${formId}-dimensions`} className={labelClass}>
                Approx Dimensions or Quantity (Optional)
              </label>
              <input
                id={`${formId}-dimensions`}
                name="dimensions"
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g. 12 ft x 7 ft gate or 40 running ft"
                maxLength={200}
                className={`${inputBase} ${inputNormal}`}
              />
            </div>

            <div>
              <label htmlFor={`${formId}-email`} className={labelClass}>
                Email (Optional, for Estimate Copy)
              </label>
              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="you@example.com"
                maxLength={254}
                className={`${inputBase} ${fieldErrors.email ? inputError : inputNormal}`}
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-xs text-red-300">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor={`${formId}-message`} className={labelClass}>
              Project Details (Optional)
            </label>
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={compact ? 2 : 3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any design notes, steel/iron preference, sliding vs swing, or timeline..."
              maxLength={4000}
              className="mt-1.5 min-h-[88px] w-full resize-y rounded-lg border border-white/15 bg-[#121212] p-3.5 text-base leading-6 text-white outline-none transition placeholder:text-white/35 focus:border-textGold/80 focus:ring-1 focus:ring-textGold/30 sm:text-sm"
            />
          </div>

          {/* Optional Reference Photo Upload */}
          <div className="rounded-xl border border-white/10 bg-[#101010] p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-white/65">
                  Reference Photo / Sketch (Optional)
                </span>
                <span className="mt-0.5 block text-xs text-white/45">
                  Upload a site picture or design idea (JPG/PNG/WebP, max 5 MB)
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-textGold/40 bg-textGold/10 px-4 text-xs font-medium text-textGold transition hover:bg-textGold hover:text-black"
              >
                <Camera size={15} /> {photoFile ? "Change Photo" : "Add Photo"}
              </button>
            </div>

            {photoPreviewUrl && photoFile && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-white/10 bg-black/50 p-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreviewUrl}
                  alt="Selected reference preview"
                  className="h-14 w-14 shrink-0 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">{photoFile.name}</p>
                  <p className="text-[11px] text-white/45">
                    {(photoFile.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearPhoto}
                  aria-label="Remove attached photo"
                  className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-red-500/30 text-red-300 hover:bg-red-950/40"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
            {fieldErrors.photo && (
              <p className="mt-2 text-xs text-red-300">{fieldErrors.photo}</p>
            )}
          </div>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-xs text-white/70">
            <input
              type="checkbox"
              checked={marketingWhatsApp}
              onChange={(e) => setMarketingWhatsApp(e.target.checked)}
              className="h-4 w-4 shrink-0 rounded border-white/25 bg-black accent-[#CDA274]"
            />
            <span>Share design photos & price estimate updates with me on WhatsApp.</span>
          </label>

          {/* Honeypot */}
          <div
            className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
            aria-hidden="true"
          >
            <label>
              Website
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>

          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-950/35 p-3.5 text-xs leading-5 text-red-200"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-full border border-textGold bg-textGold px-6 text-xs font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-white disabled:cursor-wait disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" />
                  Sending Enquiry...
                </>
              ) : (
                <>
                  Get a Free Quote <ArrowRight size={15} />
                </>
              )}
            </button>

            <span className="text-center text-[11px] text-white/45 sm:text-left">
              No account needed · Direct response from Moradabad workshop
            </span>
          </div>
        </form>
      )}
    </div>
  );
}
