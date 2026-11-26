"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Card from "./Card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimatedButton from "./AnimatedButton";
import type { croselType } from "@/utils/type";

const Feature = ({
  projects,
  heading = "Featured Projects",
  ctaLabel = "SEE PROJECTS",
  ctaHref = "/products",
  sectionId = "projects",
}: {
  projects: croselType[];
  heading?: string;
  ctaLabel?: string;
  ctaHref?: string;
  sectionId?: string;
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: number) => {
    carouselRef.current?.scrollBy({
      left: direction * carouselRef.current.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <section
      id={sectionId}
      className="mx-auto flex min-h-0 max-w-7xl flex-col gap-6 px-4 py-10 sm:min-h-[75vh] sm:gap-10 sm:px-6 sm:py-20 lg:min-h-screen lg:justify-around"
    >
      <div className="flex items-end justify-between gap-4">
        <div className="font-heading text-3xl font-light tracking-[0.01em] sm:text-4xl">
          {heading}
          <div className="mt-3 w-12 border-b border-gray-800" />
        </div>

        <div className="flex shrink-0 gap-2 sm:gap-4">
          <button
            type="button"
            aria-label="Scroll projects left"
            onClick={() => scrollCarousel(-1)}
            className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-800 bg-[#080808]/80 hover:border-textGold/30 hover:bg-[#080808]"
          >
            <ChevronLeft className="stroke-1 text-[#B3B3B3] transition-all duration-200 group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            aria-label="Scroll projects right"
            onClick={() => scrollCarousel(1)}
            className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-gray-800 bg-[#080808]/80 hover:border-textGold/30 hover:bg-[#080808]"
          >
            <ChevronRight className="stroke-1 text-[#B3B3B3] transition-all duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="scrollbar-none flex w-full max-w-full snap-x snap-mandatory gap-3 overflow-x-auto pb-3 sm:gap-4"
      >
        {projects.map((item, i) => (
          <Card
            key={item.href ?? `${item.title}-${i}`}
            href={item.href}
            title={item.title}
            description={item.description}
            tagline={item.tagline}
            image={item.image}
            loading={i === 0 ? "eager" : "lazy"}
            height="h-[58svh] min-h-[330px] max-h-[480px] sm:h-[440px] lg:h-120"
            width="w-[82vw] max-w-[350px] sm:w-[300px] lg:w-90"
            rounded="rounded-xl"
          />
        ))}
      </div>

      {ctaLabel && (
        <div className="flex w-full items-center justify-center pt-1 sm:w-auto">
          <Link href={ctaHref || "/products"}>
            <AnimatedButton text={ctaLabel} />
          </Link>
        </div>
      )}
    </section>
  );
};

export default Feature;
