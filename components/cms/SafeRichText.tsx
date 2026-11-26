import React from "react";
import Link from "next/link";
import { sanitizeUrl } from "@/lib/cms/validation";

/**
 * Renders markdown-lite structured text safely using React nodes only (no dangerouslySetInnerHTML).
 * Supports ## headings, ### subheadings, bullet lists (- item), **bold**, and [label](safe-url).
 */
function renderInline(text: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      tokens.push(
        <strong key={`b-${keyCounter++}`} className="font-medium text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("[")) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        const href = sanitizeUrl(linkMatch[2], "");
        if (href) {
          const isExternal = href.startsWith("http://") || href.startsWith("https://");
          tokens.push(
            isExternal ? (
              <a
                key={`a-${keyCounter++}`}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-textGold underline underline-offset-4 hover:text-white"
              >
                {linkMatch[1]}
              </a>
            ) : (
              <Link
                key={`l-${keyCounter++}`}
                href={href}
                className="text-textGold underline underline-offset-4 hover:text-white"
              >
                {linkMatch[1]}
              </Link>
            )
          );
        } else {
          tokens.push(linkMatch[1]);
        }
      }
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    tokens.push(text.slice(lastIndex));
  }

  return tokens;
}

export default function SafeRichText({ content }: { content: string }) {
  if (!content.trim()) return null;

  const blocks = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.startsWith("### ")) {
          const headingText = block.replace(/^###\s+/, "");
          return (
            <div key={index} className="pt-2">
              <h3 className="text-xl font-light text-textGold sm:text-2xl">
                {renderInline(headingText)}
              </h3>
              <div className="mt-2 h-0.5 w-10 bg-textGold/30" />
            </div>
          );
        }

        if (block.startsWith("## ")) {
          const headingText = block.replace(/^##\s+/, "");
          return (
            <div key={index} className="pt-4">
              <h2 className="text-2xl font-light text-white sm:text-3xl">
                {renderInline(headingText)}
              </h2>
              <div className="mt-2 h-0.5 w-12 bg-textGold" />
            </div>
          );
        }

        if (block.includes("\n- ") || block.startsWith("- ")) {
          const lines = block.split("\n");
          return (
            <ul
              key={index}
              className="space-y-3 rounded-xl border border-white/10 bg-[#0a0a0a] p-5 sm:p-6"
            >
              {lines.map((line, lIdx) => {
                const cleanLine = line.replace(/^-\s*/, "").trim();
                if (!cleanLine) return null;
                return (
                  <li
                    key={lIdx}
                    className="flex items-start gap-2.5 text-sm leading-7 text-white/75 sm:text-base"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-textGold" />
                    <span>{renderInline(cleanLine)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p
            key={index}
            className="text-sm leading-8 text-white/65 sm:text-base sm:leading-8"
          >
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}
