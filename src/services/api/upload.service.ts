import { apiClient } from '@/services/apiClient';
import type {
    UploadAudioResponse,
    UploadAudioWithMetadataResponse,
    UploadHistoryResponse,
    DropdownDataResponse,
    LpAlpSectionDataResponse,
    LpAlpSectionCombinationsResponse,
    LpFilesResponse,
} from '@/types/api.types';

export const uploadService = {
    /** Upload audio file. */
    uploadAudio(file: File, division: string): Promise<UploadAudioResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('division', division);
        return apiClient.postForm<UploadAudioResponse>('/upload-audio', formData);
    },

    /** Upload audio with metadata information. */
    uploadAudioWithMetadata(
        file: File,
        metadata: {
            division: string;
            train_number?: string;
            loco_number?: string;
            loco_pilot?: string;
            alp_name?: string;
            section?: string;
            designation?: string;
        },
    ): Promise<UploadAudioWithMetadataResponse> {
        const formData = new FormData();
        formData.append('file', file);
        for (const [key, value] of Object.entries(metadata)) {
            if (value !== undefined && value !== '') {
                formData.append(key, value);
            }
        }
        return apiClient.postForm<UploadAudioWithMetadataResponse>(
            '/upload-audio-with-metadata',
            formData,
        );
    },

    /** Get user's upload history. */
    getUploadHistory(limit?: number): Promise<UploadHistoryResponse> {
        return apiClient.get<UploadHistoryResponse>('/upload-history', { limit });
    },

    /** Get dropdown options for forms. */
    getDropdownData(division?: string): Promise<DropdownDataResponse> {
        return apiClient.get<DropdownDataResponse>('/new-dropdown-data', { division });
    },

    /** Get loco pilot, ALP, and section data. */
    getLpAlpSectionData(division?: string): Promise<LpAlpSectionDataResponse> {
        return apiClient.get<LpAlpSectionDataResponse>('/lp-alp-section-data', { division });
    },

    /** Get valid combinations of loco pilots, ALPs, and sections. */
    getLpAlpSectionCombinations(division?: string): Promise<LpAlpSectionCombinationsResponse> {
        return apiClient.get<LpAlpSectionCombinationsResponse>('/lp-alp-section-combinations', {
            division,
        });
    },

    /**
     * Get the URL for an audio file (for <audio> element src).
     * Returns a full URL string, not a fetched response.
     */
    getAudioFileUrl(fileId?: number, filename?: string): string {
        const params = new URLSearchParams();
        if (fileId !== undefined) params.append('file_id', String(fileId));
        if (filename) params.append('filename', filename);
        return `${apiClient.getBaseUrl()}/audio-file?${params.toString()}`;
    },

    /** Get all files uploaded by a specific loco pilot. */
    getLpFiles(lpName: string, division?: string): Promise<LpFilesResponse> {
        return apiClient.get<LpFilesResponse>(`/lp-files/${encodeURIComponent(lpName)}`, {
            division,
        });
    },
};
