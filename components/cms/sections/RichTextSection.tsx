import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogIndexClient from "@/components/BlogIndexClient";
import SafeRichText from "../SafeRichText";
import type { StaticBlogPost } from "@/lib/blog-data";
import type { RichTextContent } from "@/lib/cms/types";

export default function RichTextSection({
  content,
  blogPosts = [],
}: {
  content: RichTextContent;
  blogPosts?: StaticBlogPost[];
}) {
  if (content.variant === "blog_index") {
    return (
      <section
        id={content.sectionId}
        className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20"
      >
        <BlogIndexClient posts={blogPosts} />
      </section>
    );
  }

  return (
    <section
      id={content.sectionId}
      className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20"
    >
      {content.eyebrow && (
        <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-textGold">
          {content.eyebrow}
        </p>
      )}
      {content.heading && (
        <h2 className="mb-6 text-2xl font-light tracking-tight text-white sm:text-4xl">
          {content.heading}
        </h2>
      )}
      {content.description && (
        <p className="mb-8 text-base leading-7 text-white/70">{content.description}</p>
      )}

      {content.body && <SafeRichText content={content.body} />}

      {content.cta && (
        <div className="mt-8">
          <Link
            href={content.cta.href}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-textGold bg-textGold/10 px-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-textGold transition hover:bg-textGold hover:text-black"
          >
            {content.cta.label} <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </section>
  );
}
