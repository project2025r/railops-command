import { apiClient } from '@/services/apiClient';
import type {
    DashboardDataParams,
    DashboardDataResponse,
    DatabaseStatsResponse,
} from '@/types/api.types';

export const dashboardService = {
    /** Get comprehensive dashboard data with filters. */
    getDashboardData(params: DashboardDataParams): Promise<DashboardDataResponse> {
        return apiClient.get<DashboardDataResponse>('/dashboard-data', params as Record<string, string | number | undefined>);
    },

    /** Get overall database statistics. */
    getDatabaseStats(): Promise<DatabaseStatsResponse> {
        return apiClient.get<DatabaseStatsResponse>('/database-stats');
    },
};
