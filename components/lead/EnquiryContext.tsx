"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type EnquiryPrefill = {
  title?: string;
  subtitle?: string;
  categorySlug?: string;
  productId?: string;
  productSlug?: string;
  productName?: string;
  designCode?: string;
  placement?: string;
  pageUrl?: string;
};

type EnquiryContextValue = {
  isModalOpen: boolean;
  prefill: EnquiryPrefill;
  openEnquiryModal: (nextPrefill?: EnquiryPrefill) => void;
  closeEnquiryModal: () => void;
  embeddedFormInView: boolean;
  setEmbeddedFormInView: (visible: boolean) => void;
  suppressedByOverlay: boolean;
  setSuppressedByOverlay: (hidden: boolean) => void;
};

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefill, setPrefill] = useState<EnquiryPrefill>({});
  const [embeddedFormInView, setEmbeddedFormInView] = useState(false);
  const [suppressedByOverlay, setSuppressedByOverlay] = useState(false);

  const openEnquiryModal = useCallback((nextPrefill: EnquiryPrefill = {}) => {
    setPrefill(nextPrefill);
    setIsModalOpen(true);
  }, []);

  const closeEnquiryModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isModalOpen,
      prefill,
      openEnquiryModal,
      closeEnquiryModal,
      embeddedFormInView,
      setEmbeddedFormInView,
      suppressedByOverlay,
      setSuppressedByOverlay,
    }),
    [
      isModalOpen,
      prefill,
      openEnquiryModal,
      closeEnquiryModal,
      embeddedFormInView,
      suppressedByOverlay,
    ]
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) {
    throw new Error("useEnquiry must be used within EnquiryProvider");
  }
  return ctx;
}

export function useOptionalEnquiry() {
  return useContext(EnquiryContext);
}
