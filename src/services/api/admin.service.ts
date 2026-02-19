import { apiClient } from '@/services/apiClient';
import type {
    AdminFileCountsParams,
    AdminFileCountsResponse,
    RealTimeFileCountsResponse,
    AutoSyncStatusResponse,
    IngestionStatusResponse,
    ApiSuccessResponse,
} from '@/types/api.types';

export const adminService = {
    /** Get file upload counts summary for admin dashboard. */
    getFileCountsSummary(params?: AdminFileCountsParams): Promise<AdminFileCountsResponse> {
        return apiClient.get<AdminFileCountsResponse>(
            '/admin/file-counts-summary',
            params as Record<string, string | number | undefined>,
        );
    },

    /** Get real-time file count updates for admin dashboard. */
    getRealTimeFileCounts(): Promise<RealTimeFileCountsResponse> {
        return apiClient.get<RealTimeFileCountsResponse>('/admin/real-time-file-counts');
    },

    /** Manually sync files from S3 to database (Admin only). */
    syncS3ToDatabase(division?: string): Promise<ApiSuccessResponse & { files_synced: number }> {
        return apiClient.post<ApiSuccessResponse & { files_synced: number }>('/sync-s3-to-database', {
            division,
        });
    },

    /** Start automatic S3 to database sync (Admin only). */
    startAutoSync(): Promise<ApiSuccessResponse> {
        return apiClient.post<ApiSuccessResponse>('/auto-sync/start');
    },

    /** Stop automatic sync (Admin only). */
    stopAutoSync(): Promise<ApiSuccessResponse> {
        return apiClient.post<ApiSuccessResponse>('/auto-sync/stop');
    },

    /** Get auto-sync status (Admin only). */
    getAutoSyncStatus(): Promise<AutoSyncStatusResponse> {
        return apiClient.get<AutoSyncStatusResponse>('/auto-sync/status');
    },

    /** Initialize database tables (Admin only). */
    initializeDatabase(): Promise<ApiSuccessResponse> {
        return apiClient.post<ApiSuccessResponse>('/initialize-database');
    },

    /** Get status of CSV ingestion process. */
    getIngestionStatus(): Promise<IngestionStatusResponse> {
        return apiClient.get<IngestionStatusResponse>('/ingestion/status');
    },
};
