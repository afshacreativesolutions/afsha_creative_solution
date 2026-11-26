import type { StatsCountersContent } from "@/lib/cms/types";

export default function StatsCountersSection({ content }: { content: StatsCountersContent }) {
  const { items = [], columns = 4 } = content;
  if (!items.length) return null;

  const gridClass =
    columns === 5
      ? "sm:grid-cols-3 lg:grid-cols-5"
      : columns === 3
        ? "sm:grid-cols-3"
        : columns === 2
          ? "sm:grid-cols-2"
          : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section
      id={content.sectionId}
      className="border-y border-white/10 bg-[#080808] px-4 py-10 sm:px-6 sm:py-14"
    >
      <div className="mx-auto max-w-7xl">
        {(content.eyebrow || content.heading) && (
          <div className="mb-8">
            {content.eyebrow && (
              <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-textGold">
                {content.eyebrow}
              </p>
            )}
            {content.heading && (
              <h2 className="text-2xl font-light text-white sm:text-3xl">{content.heading}</h2>
            )}
          </div>
        )}

        <div className={`grid grid-cols-2 gap-6 ${gridClass}`}>
          {items.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5"
            >
              <div className="text-3xl font-light text-textGold sm:text-4xl">{item.value}</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.16em] text-white/70">
                {item.label}
              </div>
              {item.sublabel && (
                <p className="mt-1 text-xs text-white/45">{item.sublabel}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
