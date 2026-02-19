import { apiClient } from '@/services/apiClient';
import type {
    FileListResponse,
    DatabaseFilesResponse,
    FileContentResponse,
    DatabaseFileContentResponse,
    CombinedFilesResponse,
    CombinedFileContentResponse,
} from '@/types/api.types';

export const filesService = {
    /** Get all files from database (with S3 fallback). */
    getFiles(): Promise<FileListResponse> {
        return apiClient.get<FileListResponse>('/files');
    },

    /** Get files ingested into the database with optional division filtering. */
    getDatabaseFiles(division?: string): Promise<DatabaseFilesResponse> {
        return apiClient.get<DatabaseFilesResponse>('/database-files', { division });
    },

    /** Get the content of a specific file from S3. */
    getFileContent(filename: string): Promise<FileContentResponse> {
        return apiClient.get<FileContentResponse>('/file-content', { filename });
    },

    /** Get content of a file from the database with pagination. */
    getDatabaseFileContent(
        fileId: number,
        page?: number,
        perPage?: number,
    ): Promise<DatabaseFileContentResponse> {
        return apiClient.get<DatabaseFileContentResponse>('/database-file-content', {
            file_id: fileId,
            page,
            per_page: perPage,
        });
    },

    /** Get combined data from multiple files. */
    getCombinedFiles(divisions?: string): Promise<CombinedFilesResponse> {
        return apiClient.get<CombinedFilesResponse>('/combined-files', { divisions });
    },

    /** Get combined content from multiple files. */
    getCombinedFileContent(fileIds: string): Promise<CombinedFileContentResponse> {
        return apiClient.get<CombinedFileContentResponse>('/combined-file-content', {
            file_ids: fileIds,
        });
    },
};
