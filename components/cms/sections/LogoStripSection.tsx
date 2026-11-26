import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import CmsImage from "../CmsImage";
import type { LogoStripContent } from "@/lib/cms/types";

export default function LogoStripSection({ content }: { content: LogoStripContent }) {
  const { items = [] } = content;
  if (!items.length) return null;

  return (
    <section
      id={content.sectionId}
      className="border-y border-white/10 bg-[#050505] px-4 py-12 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-7xl">
        {(content.eyebrow || content.heading) && (
          <SectionHeading
            align="center"
            eyebrow={content.eyebrow}
            title={content.heading || ""}
            description={content.description}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, idx) => {
            const inner = (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0a] p-5 text-center transition hover:border-textGold/35">
                {item.image && (
                  <div className="relative mb-3 h-14 w-36 overflow-hidden">
                    <CmsImage
                      image={item.image}
                      altFallback={item.name}
                      sizes="144px"
                      className="object-contain"
                    />
                  </div>
                )}
                <p className="text-sm font-light text-white">{item.name}</p>
                {item.caption && (
                  <p className="mt-1 text-xs text-white/50">{item.caption}</p>
                )}
              </div>
            );

            return item.href ? (
              <Link key={item.id || `${item.name}-${idx}`} href={item.href}>
                {inner}
              </Link>
            ) : (
              <div key={item.id || `${item.name}-${idx}`}>{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
