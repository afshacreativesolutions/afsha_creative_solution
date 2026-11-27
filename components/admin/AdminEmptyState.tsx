import type { ReactNode } from "react";

export default function AdminEmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-dashed border-white/15 bg-[#0a0a0a] px-5 py-12 text-center ${className}`}
    >
      {icon && <div className="mx-auto mb-3 flex justify-center text-white/30">{icon}</div>}
      <p className="text-sm font-medium text-white/80">{title}</p>
      {description && (
        <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-white/45">{description}</p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
