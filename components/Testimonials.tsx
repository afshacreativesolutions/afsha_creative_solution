import React from "react";
import AnimatedButton from "./AnimatedButton";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import CmsImage from "./cms/CmsImage";
import type { TestimonialsContent } from "@/lib/cms/types";

const defaultItems: TestimonialsContent["items"] = [
  {
    id: "review-mohit",
    author: "Mohit Agarwal",
    role: "Homeowner, Civil Lines, Moradabad",
    quote:
      "“We needed a custom main gate for our house. The team understood the design we wanted and delivered a strong, well-finished gate.”",
    avatarLetter: "M",
    avatarBgClass: "bg-green-700",
    image: { url: "asset:iron_gates.ironGate5", alt: "Custom wrought iron main gate" },
    imagePosition: "bottom",
  },
  {
    id: "review-rahul",
    author: "Rahul Sharma",
    role: "Homeowner, Ram Ganga Vihar, Moradabad",
    quote:
      "“The stair railing was designed exactly according to our requirement. The finishing looks clean and the overall work was handled professionally.”",
    avatarLetter: "R",
    avatarBgClass: "bg-blue-700",
    image: { url: "asset:steel_stair_railing.ssStairRailling8", alt: "Stainless steel stair railing" },
    imagePosition: "top",
  },
  {
    id: "review-amit",
    author: "Amit Verma",
    role: "Residential Project, Rampur Road",
    quote:
      "“We wanted a modern balcony railing for our new home. The design and fabrication turned out very well and matched the look of the house.”",
    avatarLetter: "A",
    avatarBgClass: "bg-red-700",
    image: { url: "asset:steel_balcony_railing.ssBalconyRailling9", alt: "Modern balcony railing" },
    imagePosition: "bottom",
  },
];

const defaultStats: NonNullable<TestimonialsContent["stats"]> = [
  { value: "80+", label: "Google Reviews" },
  { value: "100+", label: "Custom Railings" },
  { value: "400+", label: "Custom Gates" },
  { value: "10+", label: "Years Experience" },
  { value: "99.4%", label: "On-Time Handover" },
];

function StarsRow({ size = 15 }: { size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[0, 1, 2, 3, 4].map((idx) => (
        <Image
          key={idx}
          src="/star.svg"
          width={size}
          height={size}
          alt="star"
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      ))}
    </div>
  );
}

const Testimonials = ({
  sectionId = "testimonials",
  heading = "CRAFTED FOR SPACES. TRUSTED BY CUSTOMERS.",
  description = "From the first measurement to the finished installation, our work is built around the customer's requirements. See what customers have to say about their experience with Afsha Creative Solution",
  cta = { label: "GET A QUOTE", href: "/contact" },
  highlightCard = null,
  items = defaultItems,
  showStats = true,
  stats = defaultStats,
}: Partial<TestimonialsContent>) => {
  const activeStats = stats ?? defaultStats;
  // Filter out any legacy template placeholder text if present in un-updated CMS data
  const safeHighlight =
    highlightCard && !/railingo/i.test(highlightCard.quote || "") ? highlightCard : null;

  return (
    <section id={sectionId} aria-label="Testimonials" className="overflow-x-clip bg-cardGray/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:gap-8 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-5">
          <div className="w-full font-heading text-2xl font-extralight tracking-[0.01em] sm:w-[45%] sm:text-3xl">
            {heading}
          </div>

          <div className="w-full text-left text-sm font-light text-textGray sm:w-[45%] sm:text-right">
            {description}
            {cta && (
              <>
                <br />
                <Link
                  href={cta.href}
                  aria-label={cta.label}
                  className="inline-block"
                >
                  <div className="mt-4 flex justify-start sm:mt-5 sm:justify-end">
                    <AnimatedButton text={cta.label} />
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto border-b border-white/10 px-4 pb-8 scroll-pl-4 sm:mx-0 sm:gap-5 sm:px-0 sm:pb-12 sm:scroll-pl-0">
          {/* Verified Google Business Profile Card */}
          {safeHighlight ? (
            <div className="flex h-[460px] w-[min(82vw,290px)] shrink-0 snap-start flex-col justify-between rounded-xl border border-white/[0.06] bg-cardGray p-4 sm:h-[480px] sm:w-[280px]">
              <div className="flex items-center justify-between border-b border-white/10 px-1 py-3 sm:py-4">
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10">
                  <Image
                    src="/google-lens-icon.png"
                    width={20}
                    height={20}
                    alt="google-logo"
                    className="h-5 w-5 object-contain"
                  />
                </div>
                <div>
                  <div className="text-sm">{safeHighlight.title}</div>
                  <div className="flex items-center gap-0.5">
                    <StarsRow size={15} />
                    <div className="ml-1 text-[9px] text-textGray">
                      {safeHighlight.ratingCountLabel}
                    </div>
                  </div>
                </div>

                <div className="flex h-5 w-16 items-center justify-center gap-1 rounded-xl border border-green-300/50 bg-green-800/30">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <div className="text-[10px] font-light text-green-400">
                    {safeHighlight.verifiedLabel}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-b border-white/10 px-1 py-3 sm:gap-4 sm:py-4">
                <div className="flex items-center justify-between">
                  <StarsRow size={18} />
                  <div className="text-[9px] font-light text-textGray">
                    {safeHighlight.timeAgo}
                  </div>
                </div>

                <div className="text-xs italic font-extralight leading-relaxed text-white/90 sm:text-sm">
                  {safeHighlight.quote}
                </div>
              </div>

              <div className="flex items-center gap-2.5 border-b border-white/10 px-1 py-3 sm:py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-700 text-sm font-medium">
                  {safeHighlight.avatarLetter}
                </div>
                <div className="text-sm">
                  {safeHighlight.author}
                  <div className="text-[9px] font-extralight text-textGray">
                    {safeHighlight.authorRole}
                  </div>
                </div>
              </div>

              {safeHighlight.buttonLabel && (
                <div className="flex items-center justify-center py-3 sm:py-4">
                  <a
                    href={safeHighlight.buttonHref || "#"}
                    target={safeHighlight.buttonHref?.startsWith("http") ? "_blank" : undefined}
                    rel={
                      safeHighlight.buttonHref?.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-light tracking-[0.1em] transition-colors hover:border-textGold/30 hover:bg-textGold/10 hover:text-textGold"
                  >
                    {safeHighlight.buttonLabel}
                    <ExternalLink className="w-2.5 stroke-2" />
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-[460px] w-[min(82vw,290px)] shrink-0 snap-start flex-col justify-between rounded-xl border border-textGold/20 bg-cardGray p-5 sm:h-[480px] sm:w-[280px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10">
                  <Image
                    src="/google-lens-icon.png"
                    width={20}
                    height={20}
                    alt="Google Reviews"
                    className="h-5 w-5 object-contain"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">GOOGLE REVIEWS</div>
                  <div className="flex items-center gap-1">
                    <StarsRow size={14} />
                    <span className="ml-1 text-[10px] text-textGray">80+ Reviews</span>
                  </div>
                </div>
              </div>

              <div className="my-auto space-y-3 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-textGold">
                  Afsha Creative Solution · Moradabad
                </p>
                <p className="text-sm font-light leading-7 text-white/80">
                  Trusted by homeowners, builders, and architects across Moradabad &amp; Western UP
                  for durable gates and clean site installation.
                </p>
              </div>

              <a
                href="https://maps.google.com/?cid=7804843562812692638&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=en&gl=IN&source=embed"
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-textGold/30 bg-textGold/10 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-textGold transition hover:bg-textGold hover:text-black"
              >
                Read Reviews on Google <ExternalLink className="w-3 stroke-2" />
              </a>
            </div>
          )}

          {/* Client Review Cards */}
          {(items ?? []).map((item) => {
            const reviewBox = (
              <div className="flex h-[245px] w-full flex-col justify-between rounded-xl border border-white/10 bg-cardGray p-4 sm:h-[260px]">
                <div className="px-1">
                  <StarsRow size={15} />
                </div>

                <div className="border-b border-white/10 px-1 py-3.5 text-xs italic font-extralight leading-relaxed text-white/90 sm:py-4">
                  {item.quote}
                </div>

                <div className="flex items-center gap-2.5 px-1 pt-2 sm:pt-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
                      item.avatarBgClass || "bg-amber-700"
                    }`}
                  >
                    {item.avatarLetter || item.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    {item.author}
                    <div className="text-[9px] font-extralight text-textGray">{item.role}</div>
                  </div>
                </div>
              </div>
            );

            const imageBox = item.image ? (
              <div className="relative h-[195px] w-full overflow-hidden rounded-xl sm:h-[200px]">
                <CmsImage
                  image={item.image}
                  altFallback={item.author}
                  sizes="(max-width: 640px) 290px, 280px"
                  className="object-cover"
                />
              </div>
            ) : null;

            return (
              <div
                key={item.id}
                className="flex h-[460px] w-[min(82vw,290px)] shrink-0 snap-start flex-col justify-between sm:h-[480px] sm:w-[280px]"
              >
                {item.imagePosition === "top" ? (
                  <>
                    {imageBox}
                    {reviewBox}
                  </>
                ) : (
                  <>
                    {reviewBox}
                    {imageBox}
                  </>
                )}
              </div>
            );
          })}

          <div className="w-1 shrink-0 sm:hidden" aria-hidden="true" />
        </div>

        {/* Stats Counter */}
        {showStats && activeStats.length > 0 && (
          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 sm:gap-y-6 lg:flex lg:items-center lg:justify-between">
            {activeStats.map((stat, idx) => (
              <div
                key={`${stat.label}-${idx}`}
                className={`text-3xl font-light sm:text-4xl lg:text-5xl ${
                  idx === activeStats.length - 1 && activeStats.length % 2 === 1
                    ? "col-span-2 sm:col-span-1"
                    : ""
                }`}
              >
                {stat.value}
                <div className="mt-1.5 text-[9px] font-extralight uppercase tracking-wider text-textGray sm:text-[10px]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
