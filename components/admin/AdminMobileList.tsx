import type { ReactNode } from "react";

export default function AdminMobileList({
  children,
  emptyState,
  isEmpty = false,
  className = "",
}: {
  children: ReactNode;
  emptyState?: ReactNode;
  isEmpty?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-3 md:hidden ${className}`}>
      {isEmpty && emptyState ? emptyState : children}
    </div>
  );
}
