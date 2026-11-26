"use client";

import React, { useState } from "react";
import Card from "./Card";
import type { collectionDataType } from "@/utils/type";
import AnimatedButton from "./AnimatedButton";
import Link from "next/link";

export const Collections = ({
  collectionsData,
  heading = "Our Collections",
  sectionId = "collection",
}: {
  collectionsData: collectionDataType;
  heading?: string;
  sectionId?: string;
}) => {
  const collection = Object.keys(collectionsData) as Array<keyof collectionDataType>;
  const [selectCollecton, setSelectCollection] = useState<keyof collectionDataType>(
    collection[0] ?? "Raillings"
  );

  return (
    <section
      id={sectionId}
      className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-10 sm:min-h-[80vh] sm:justify-between sm:gap-10 sm:px-6 sm:py-20"
    >
      <div className="flex flex-col gap-3">
        <div className="text-center font-heading text-2xl font-light tracking-[0.01em] sm:text-4xl">
          {heading}
          <div className="mx-auto mt-2 w-12 border-b border-gray-700" />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {collection.map((item) => (
            <button
              type="button"
              onClick={() => setSelectCollection(item)}
              key={item}
              aria-pressed={selectCollecton === item}
              className={`inline-flex min-h-11 touch-manipulation cursor-pointer select-none items-center justify-center rounded-3xl border px-4 py-3 text-xs uppercase tracking-[0.04em] transition-colors active:scale-[0.98] sm:text-sm ${
                selectCollecton === item
                  ? "border-textGold/40 bg-textGold/70 font-semibold text-black"
                  : "border-gray-800 bg-[#080808]/80 text-[#B3B3B3] hover:border-gray-600 hover:bg-[#080808] hover:text-gray-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid w-full grid-cols-2 items-center justify-center gap-2.5 py-1 sm:flex sm:flex-wrap sm:gap-4 sm:py-4">
        {collectionsData[selectCollecton]?.map((item) => (
          <Card
            key={`${selectCollecton}-${item.title}`}
            title={item.title}
            image={item.image}
            href={item.href}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 240px, 240px"
            height="h-[48vw] min-h-[160px] max-h-[250px] sm:h-60"
            width="w-full sm:w-60"
            rounded="rounded-xl"
          />
        ))}
      </div>

      <div className="flex w-full justify-center sm:w-auto">
        <Link
          href={`/products?category=${selectCollecton === "Gates" ? "gates" : "railings"}&material=all`}
          className="block w-full max-w-[280px] sm:w-auto"
        >
          <AnimatedButton
            text={`Explore ${selectCollecton === "Gates" ? "Gates" : "Railings"}`}
          />
        </Link>
      </div>
    </section>
  );
};
