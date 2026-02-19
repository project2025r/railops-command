import { useQuery } from '@tanstack/react-query';
import { dashboardService, transcriptsService } from '@/services/api';
import type {
    DashboardDataParams,
    TranscriptKpiParams,
    ViolationAnalysisParams,
} from '@/types/api.types';

/** Query key constants for dashboard. */
export const dashboardKeys = {
    data: (params: DashboardDataParams) => ['dashboard', 'data', params] as const,
    stats: ['dashboard', 'stats'] as const,
    kpi: (params: TranscriptKpiParams) => ['dashboard', 'kpi', params] as const,
    violations: (params: ViolationAnalysisParams) => ['dashboard', 'violations', params] as const,
};

/** Fetch dashboard data. Only runs when `enabled` is true (e.g. after filters applied). */
export function useDashboardData(params: DashboardDataParams, enabled = true) {
    return useQuery({
        queryKey: dashboardKeys.data(params),
        queryFn: () => dashboardService.getDashboardData(params),
        enabled,
    });
}

/** Fetch database statistics. */
export function useDatabaseStats() {
    return useQuery({
        queryKey: dashboardKeys.stats,
        queryFn: () => dashboardService.getDatabaseStats(),
        staleTime: 2 * 60 * 1000,
    });
}

/** Fetch transcript KPIs. */
export function useTranscriptKpi(params: TranscriptKpiParams, enabled = true) {
    return useQuery({
        queryKey: dashboardKeys.kpi(params),
        queryFn: () => transcriptsService.getTranscriptKpi(params),
        enabled,
    });
}

/** Fetch violation analysis. */
export function useViolationAnalysis(params: ViolationAnalysisParams, enabled = true) {
    return useQuery({
        queryKey: dashboardKeys.violations(params),
        queryFn: () => transcriptsService.getViolationAnalysis(params),
        enabled,
    });
}
