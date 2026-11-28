import React from "react";
import TrackedActionLink from "@/components/lead/TrackedActionLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { buildGeneralWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { CmsSiteIdentitySetting } from "@/lib/cms/types";

const LEGACY_DEFAULT_MSG =
  "Hello Afsha Creative Solution, I found your website and would like to discuss a metal fabrication project.";

const Whatsapp = ({ identity }: { identity?: CmsSiteIdentitySetting }) => {
  if (identity && identity.showFloatingWhatsapp === false) {
    return null;
  }

  const configuredMsg = identity?.whatsappDefaultMessage?.trim();
  const message =
    configuredMsg && configuredMsg !== LEGACY_DEFAULT_MSG
      ? configuredMsg
      : buildGeneralWhatsAppMessage();

  const href = buildWhatsAppUrl({
    whatsappNumber: identity?.whatsappNumber,
    message,
  });

  return (
    <TrackedActionLink
      href={href}
      eventName="whatsapp_click"
      trackingProps={{
        placement: "desktop_floating_whatsapp",
        channel: "whatsapp",
      }}
      target="_blank"
      rel="noopener noreferrer"
      ariaLabel="Enquire on WhatsApp"
      className="fixed bottom-5 right-5 z-50 hidden md:block"
    >
      <div className="group flex min-h-12 min-w-12 items-center justify-center rounded-full border border-textGold/60 bg-[#0d0d0d] p-3 text-textGold shadow-[0_10px_30px_rgba(0,0,0,0.65)] transition duration-300 ease-in-out hover:border-textGold hover:bg-textGold hover:text-black">
        <WhatsAppIcon size={26} />
      </div>
    </TrackedActionLink>
  );
};

export default Whatsapp;
