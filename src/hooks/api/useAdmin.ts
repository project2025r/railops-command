import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/api';
import type { AdminFileCountsParams } from '@/types/api.types';

/** Query key constants for admin. */
export const adminKeys = {
    fileCounts: (params?: AdminFileCountsParams) => ['admin', 'fileCounts', params] as const,
    realTimeCounts: ['admin', 'realTimeCounts'] as const,
};

/** Fetch file counts summary for admin dashboard. */
export function useFileCountsSummary(params?: AdminFileCountsParams) {
    return useQuery({
        queryKey: adminKeys.fileCounts(params),
        queryFn: () => adminService.getFileCountsSummary(params),
    });
}

/** Fetch real-time file counts, auto-refreshing every 30 seconds. */
export function useRealTimeFileCounts() {
    return useQuery({
        queryKey: adminKeys.realTimeCounts,
        queryFn: () => adminService.getRealTimeFileCounts(),
        refetchInterval: 30_000, // Refresh every 30 seconds
    });
}
