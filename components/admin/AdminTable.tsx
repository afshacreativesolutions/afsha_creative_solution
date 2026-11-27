import type { ReactNode } from "react";

export default function AdminTable({
  children,
  className = "",
  minWidthClass = "",
}: {
  children: ReactNode;
  className?: string;
  minWidthClass?: string;
}) {
  return (
    <div
      className={`hidden overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] md:block ${className}`}
    >
      <div className="overflow-x-auto">
        <table className={`w-full border-collapse text-left text-xs ${minWidthClass}`}>
          {children}
        </table>
      </div>
    </div>
  );
}
