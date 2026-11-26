import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Hammer,
  Layers,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import type { FeaturesContent } from "@/lib/cms/types";

const ICON_MAP = {
  sparkles: Sparkles,
  wrench: Wrench,
  check: CheckCircle2,
  shield: ShieldCheck,
  hammer: Hammer,
  layers: Layers,
};

export default function FeaturesSection({ content }: { content: FeaturesContent }) {
  const { variant = "step_cards", items = [] } = content;

  if (variant === "process_with_callout") {
    return (
      <section
        id={content.sectionId}
        className="border-y border-white/10 bg-[#050505]"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
            <div>
              {content.eyebrow && (
                <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">
                  {content.eyebrow}
                </p>
              )}
              <h2 className="text-2xl font-light tracking-tight sm:text-4xl">
                {content.heading}
              </h2>
            </div>
            {content.description && (
              <p className="max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                {content.description}
              </p>
            )}
          </div>

          <ol className="mt-9 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-4">
            {items.map((step, idx) => (
              <li
                key={`${step.number}-${idx}`}
                className="rounded-xl border border-white/10 bg-[#090909] p-5 sm:p-6"
              >
                <span className="text-[10px] tracking-[0.2em] text-textGold">
                  STEP {step.number || String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-base font-light text-white sm:text-lg">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/50">{step.description}</p>
              </li>
            ))}
          </ol>

          {content.callout && (
            <div className="mt-6 flex flex-col gap-3 rounded-xl border border-textGold/20 bg-textGold/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                {content.callout.eyebrow && (
                  <p className="text-[9px] uppercase tracking-[0.2em] text-textGold">
                    {content.callout.eyebrow}
                  </p>
                )}
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">
                  {content.callout.text}
                </p>
              </div>
              <Link
                href={content.callout.buttonHref || "/contact"}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 text-[9px] font-medium uppercase tracking-[0.18em] text-textGold transition-colors hover:text-white"
              >
                {content.callout.buttonLabel} <ArrowUpRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (variant === "timeline_rows") {
    const total = String(items.length).padStart(2, "0");
    return (
      <section
        id={content.sectionId}
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20"
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            {content.eyebrow && (
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">
                {content.eyebrow}
              </p>
            )}
            <h2 className="text-3xl font-light tracking-tight sm:text-5xl">
              {content.heading}
            </h2>
            {content.description && (
              <p className="mt-4 max-w-md text-sm leading-7 text-white/55">
                {content.description}
              </p>
            )}
          </div>
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {items.map((step, idx) => (
              <li
                key={`${step.number}-${idx}`}
                className="grid gap-2 py-5 sm:grid-cols-[72px_0.75fr_1.25fr] sm:items-start sm:gap-4 sm:py-6"
              >
                <span className="text-[10px] tracking-[0.2em] text-textGold">
                  {step.number || String(idx + 1).padStart(2, "0")} / {total}
                </span>
                <h3 className="text-base font-light text-white sm:text-lg">{step.title}</h3>
                <p className="text-sm leading-6 text-white/50">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  if (variant === "phase_cards") {
    return (
      <section
        id={content.sectionId}
        className="border-y border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            align={content.align || "center"}
            eyebrow={content.eyebrow}
            title={content.heading}
            description={content.description}
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-5">
            {items.map((phase, idx) => (
              <div
                key={`${phase.number}-${idx}`}
                className="rounded-xl border border-white/10 bg-[#090909] p-5 sm:p-6"
              >
                <span className="text-[10px] font-semibold tracking-[0.24em] text-textGold">
                  PHASE {phase.number || String(idx + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-base font-light text-white">{phase.title}</h3>
                <p className="mt-2 text-xs leading-5 text-white/50">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // step_cards
  return (
    <section
      id={content.sectionId}
      className={`${
        content.background === "darker" ? "border-y border-white/10 bg-[#050505]" : ""
      } px-4 py-12 sm:px-6 sm:py-20`}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          align={content.align || "center"}
          eyebrow={content.eyebrow}
          title={content.heading}
          description={content.description}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {items.map((step, idx) => {
            const Icon = step.icon ? ICON_MAP[step.icon] : Sparkles;
            return (
              <div
                key={`${step.number}-${idx}`}
                className="relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#090909] p-6 transition duration-300 hover:border-textGold/40 sm:p-7"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-[0.24em] text-textGold">
                      STEP {step.number || String(idx + 1).padStart(2, "0")}
                    </span>
                    <Icon size={18} className="text-textGold/60" />
                  </div>

                  <h3 className="mt-6 text-lg font-light text-white sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{step.description}</p>
                </div>

                <div className="mt-6 h-0.5 w-8 bg-textGold/30" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
