import { Skeleton } from "@/components/ui/skeleton";

export const DashboardSkeleton = () => (
    <div className="p-4 md:p-8 space-y-6">
        <div className="pb-6 border-b border-zinc-800/60">
            <Skeleton className="h-10 w-64 bg-zinc-800" />
            <Skeleton className="h-6 w-96 bg-zinc-800 mt-2" />
        </div>
        <div className="py-4 border-b border-zinc-800/60">
            <Skeleton className="h-10 w-full bg-zinc-800" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl bg-zinc-800" />
            ))}
        </div>
    </div>
);