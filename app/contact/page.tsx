import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail, MapPin, MessageCircle, Phone, UserRound } from "lucide-react";
import { getPublicCategories } from "@/lib/catalog";
import EnquiryForm from "./enquiry-form";
import Image from "next/image";
import { portraits } from "@/utils/images";

export const metadata: Metadata = {
  title: "Contact | Afsha Creative Solution",
  description: "Talk with Afsha Creative Solution about custom gates, railings, and architectural metalwork in Moradabad.",
  alternates: { canonical: "/contact" },
};

const contactMethods = [
  {
    label: "WhatsApp",
    value: "Chat with our team",
    href: "https://wa.me/919634776691?text=Hello%20Afsha%20Creative%20Solution%2C%20I%20would%20like%20to%20discuss%20a%20custom%20metalwork%20project.",
    icon: MessageCircle,
  },
  { label: "Call", value: "+91 96347 76691", href: "tel:+919634776691", icon: Phone },
  { label: "Email", value: "afshacreativesolutions@gmail.com", href: "mailto:afshacreativesolutions@gmail.com", icon: Mail },
];

export default async function ContactPage() {
  const categories = await getPublicCategories();
  return (
    <main className="min-h-[70vh] bg-background px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-textGold">
          <ArrowLeft size={14} /> Home
        </Link>

        <section className="mt-5 border-y border-white/10 py-8 sm:mt-7 sm:py-12">
          <div className="max-w-3xl">
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">Start a conversation</p>
            <h1 className="text-4xl font-light leading-tight tracking-tight sm:text-6xl">Let&apos;s shape your next project.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:mt-5 sm:text-base">Tell us about your space, preferred material, and the design you have in mind. We&apos;ll help you plan the next steps.</p>
          </div>

          <div className="mt-7 grid gap-3 sm:mt-9 sm:grid-cols-2 lg:grid-cols-3">
            {contactMethods.map(({ label, value, href, icon: Icon }) => (
              <a key={label} href={href} className="group flex min-h-24 min-w-0 items-center gap-4 rounded-lg border border-white/10 bg-[#080808] p-4 transition-colors hover:border-textGold/50 sm:min-h-28 sm:p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-textGold/30 text-textGold"><Icon size={18} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[9px] uppercase tracking-[0.18em] text-white/40">{label}</span>
                  <span className="mt-2 block break-words text-sm leading-5 text-white/85">{value}</span>
                </span>
                <ArrowUpRight size={15} className="shrink-0 text-white/30 transition-colors group-hover:text-textGold" />
              </a>
            ))}
          </div>
        </section>

        <section className="py-8 sm:py-12" aria-labelledby="enquiry-heading">
          <div className="mb-6 max-w-2xl sm:mb-8">
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">Project enquiry</p>
            <h2 id="enquiry-heading" className="text-3xl font-light leading-tight sm:text-4xl">Tell us what you have in mind.</h2>
            <p className="mt-3 text-sm leading-7 text-white/55">Share a few details and our team will get back to you about your project.</p>
          </div>
          <EnquiryForm categories={categories.map(({ slug, name }) => ({ slug, name }))} />
        </section>

        <section className="grid gap-6 py-8 sm:gap-8 sm:py-12 lg:grid-cols-[0.82fr_1fr] lg:items-center lg:gap-14">
          
<div className="group relative flex aspect-[4/3] min-h-[230px] items-end overflow-hidden rounded-xl border border-white/10 bg-[#080808] sm:min-h-[300px]">

  {/* Owner portrait */}
  <Image
    src={portraits.Portait2}
    alt="Business owner of Afsha Creative Solutions"
    fill
    priority
    sizes="(max-width: 640px) 100vw, 50vw"
    className="object-cover object-[center_1%] transition-transform duration-700 group-hover:scale-[1.03]"
  />

  {/* Black and gold shadow overlay */}
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/20"
  />

  {/* Gold ambient lighting */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_10%,rgba(205,162,116,0.20),transparent_55%)]"
  />

  {/* Inner border */}
  {/* <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-5 z-10 rounded-lg border border-white/20 sm:inset-7"
  /> */}

  {/* Owner label */}
  <div className="relative z-20 p-5 sm:p-7">
    <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#D4A66A]">
      Business Owner
    </p>
    <p className="mt-1 text-xs text-white/70 font-semibold">
      Afsha Creative Solutions
    </p>
  </div>

</div>


          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">The person behind the work</p>
            <h2 className="text-3xl font-light leading-tight sm:text-4xl">Personal attention, from first sketch to final fit.</h2>
            <p className="mt-4 text-sm leading-7 text-white/55">Speak directly with the business owner about your project requirements, measurements, materials, and finish preferences.</p>
            <a href="https://maps.google.com/?cid=7804843562812692638" target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-3 text-sm text-white/75 transition-colors hover:text-textGold">
              <MapPin size={16} className="shrink-0 text-textGold" />
              <span>Harthala, Lodhipur, Moradabad, Uttar Pradesh 244001</span>
              <ArrowUpRight size={14} className="shrink-0" />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
