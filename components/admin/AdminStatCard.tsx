import type { ReactNode } from "react";

export default function AdminStatCard({
  label,
  value,
  subtext,
  icon,
  valueClassName = "text-white",
  className = "",
}: {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  valueClassName?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-5 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 text-white/50">
        <span className="truncate text-[10px] font-medium uppercase tracking-[0.16em]">
          {label}
        </span>
        {icon && <span className="shrink-0 text-textGold">{icon}</span>}
      </div>
      <div className={`mt-2.5 text-2xl font-light sm:text-3xl ${valueClassName}`}>
        {value}
      </div>
      {subtext && <p className="mt-1 truncate text-xs text-white/45">{subtext}</p>}
    </div>
  );
}
