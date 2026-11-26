"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ALL_GRANTED_CATEGORIES,
  ConsentCategories,
  ConsentState,
  DEFAULT_DENIED_CATEGORIES,
} from "@/lib/consent-types";
import {
  applyGoogleConsent,
  readStoredConsent,
  saveConsentChoice,
} from "@/lib/consent-store";

type ConsentContextType = {
  consent: ConsentState | null;
  isBannerVisible: boolean;
  isModalOpen: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  saveCustom: (categories: ConsentCategories) => void;
  openSettings: () => void;
  closeSettings: () => void;
};

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
      const existing = readStoredConsent();
      if (existing) {
        setConsent(existing);
        applyGoogleConsent(existing.categories);
        setIsBannerVisible(false);
      } else {
        setIsBannerVisible(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  async function postConsentRecord(state: ConsentState) {
    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
    } catch (err) {
      console.warn("Failed to log consent to server:", err);
    }
  }

  function handleChoice(categories: ConsentCategories, action: ConsentState["action"]) {
    const updated = saveConsentChoice(categories, action);
    setConsent(updated);
    applyGoogleConsent(updated.categories);
    setIsBannerVisible(false);
    setIsModalOpen(false);
    void postConsentRecord(updated);
  }

  const acceptAll = () => handleChoice(ALL_GRANTED_CATEGORIES, "accept_all");
  const rejectNonEssential = () => handleChoice(DEFAULT_DENIED_CATEGORIES, "reject_optional");
  const saveCustom = (categories: ConsentCategories) => handleChoice(categories, "custom_save");

  const openSettings = () => setIsModalOpen(true);
  const closeSettings = () => setIsModalOpen(false);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        isBannerVisible: mounted && isBannerVisible,
        isModalOpen: mounted && isModalOpen,
        acceptAll,
        rejectNonEssential,
        saveCustom,
        openSettings,
        closeSettings,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return ctx;
}
