import type { ReactNode } from "react";

/**
 * Consistent responsive form footer/toolbar keeping primary save and status feedback
 * prominent on touchscreens without overlapping fields when mobile keyboards open.
 */
export default function AdminFormActions({
  status,
  children,
  className = "",
}: {
  status?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-white/10 bg-[#0b0b0b] p-4 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div aria-live="polite" className="min-w-0 text-xs text-white/65">
        {status}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">{children}</div>
    </div>
  );
}
