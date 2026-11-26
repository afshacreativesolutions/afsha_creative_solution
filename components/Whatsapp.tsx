import { icons } from "@/utils/images";
import Link from "next/link";
import React from "react";
import type { CmsSiteIdentitySetting } from "@/lib/cms/types";

const Whatsapp = ({ identity }: { identity?: CmsSiteIdentitySetting }) => {
  if (identity && identity.showFloatingWhatsapp === false) {
    return null;
  }

  const number = (identity?.whatsappNumber || "919634776691").replace(/\D/g, "");
  const message =
    identity?.whatsappDefaultMessage ||
    "Hello Afsha Creative Solution, I found your website and would like to discuss a metal fabrication project.";
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-5 right-5 z-50"
    >
      <div className="group w-fit rounded-full bg-green-500 p-2 transition duration-300 ease-in-out hover:bg-green-500/60">
        <span
          aria-hidden="true"
          className="block h-10 w-10 bg-current text-white transition-colors duration-300 group-hover:text-textGold/80"
          style={{
            maskImage: `url(${icons.whatsapp.src})`,
            WebkitMaskImage: `url(${icons.whatsapp.src})`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskSize: "contain",
            WebkitMaskSize: "contain",
          }}
        />
      </div>
    </Link>
  );
};

export default Whatsapp;
