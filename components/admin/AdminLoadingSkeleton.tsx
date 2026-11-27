export default function AdminLoadingSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading admin content"
      className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-10"
    >
      <div className="mb-8 space-y-2.5 border-b border-white/10 pb-5">
        <div className="h-3 w-28 animate-pulse rounded bg-textGold/20" />
        <div className="h-8 w-56 max-w-full animate-pulse rounded bg-white/15" />
        <div className="h-3.5 w-80 max-w-full animate-pulse rounded bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-5"
          >
            <div className="flex justify-between">
              <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-4 animate-pulse rounded bg-textGold/20" />
            </div>
            <div className="h-7 w-14 animate-pulse rounded bg-white/20" />
            <div className="h-2.5 w-24 animate-pulse rounded bg-white/10" />
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 rounded-xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-6">
        <div className="h-4 w-44 animate-pulse rounded bg-textGold/20" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 border-t border-white/5 pt-3.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="space-y-1.5">
              <div className="h-4 w-48 max-w-full animate-pulse rounded bg-white/15" />
              <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
            </div>
            <div className="h-8 w-24 animate-pulse rounded-lg bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
