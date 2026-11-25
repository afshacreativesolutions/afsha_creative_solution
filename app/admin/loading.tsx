export default function AdminLoading() {
  return (
    <div className="min-h-[75vh] bg-[#080808] text-white">
      {/* Top Navigation Skeleton */}
      <div className="flex flex-col gap-3 border-b border-white/10 bg-[#060606] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-4">
        <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
        <div className="flex items-center gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-3 w-16 animate-pulse rounded bg-white/10" />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        {/* Header Skeleton */}
        <div className="mb-8 space-y-2">
          <div className="h-3 w-32 animate-pulse rounded bg-textGold/20" />
          <div className="h-8 w-64 animate-pulse rounded bg-white/15" />
          <div className="h-3 w-96 animate-pulse rounded bg-white/10" />
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-[#0d0d0d] p-5 space-y-3"
            >
              <div className="flex justify-between">
                <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-4 animate-pulse rounded bg-textGold/20" />
              </div>
              <div className="h-8 w-16 animate-pulse rounded bg-white/20" />
              <div className="h-2 w-32 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>

        {/* Content Table / List Skeleton */}
        <div className="mt-8 rounded-xl border border-white/10 bg-[#0d0d0d] p-6 space-y-4">
          <div className="h-4 w-48 animate-pulse rounded bg-textGold/20" />
          <div className="space-y-3 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-t border-white/5 pt-3"
              >
                <div className="space-y-1">
                  <div className="h-3.5 w-44 animate-pulse rounded bg-white/15" />
                  <div className="h-2.5 w-28 animate-pulse rounded bg-white/10" />
                </div>
                <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                <div className="h-5 w-16 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
