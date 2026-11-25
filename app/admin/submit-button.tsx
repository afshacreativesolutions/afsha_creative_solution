"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  loadingText?: string;
  icon?: React.ReactNode;
}

export function SubmitButton({
  children = "Submit",
  loadingText,
  icon,
  className = "",
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-disabled={pending || disabled}
      className={className}
      {...props}
    >
      {pending ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0 text-current" />
          <span>{loadingText || "Please wait..."}</span>
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-2">
          {icon}
          {children}
        </span>
      )}
    </button>
  );
}

export default SubmitButton;
