import { apiClient } from '@/services/apiClient';
import type {
    KeywordsResponse,
    AddKeywordRequest,
    UpdateKeywordRequest,
    ApiSuccessResponse,
} from '@/types/api.types';

export const keywordsService = {
    /** Get all tracked keywords. */
    getKeywords(division?: string): Promise<KeywordsResponse> {
        return apiClient.get<KeywordsResponse>('/keywords', { division });
    },

    /** Add new keyword to be tracked (Admin only). */
    addKeyword(data: AddKeywordRequest): Promise<ApiSuccessResponse & { keyword_id: number }> {
        return apiClient.post<ApiSuccessResponse & { keyword_id: number }>('/keywords/add', data);
    },

    /** Update keyword information (Admin only). */
    updateKeyword(data: UpdateKeywordRequest): Promise<ApiSuccessResponse> {
        return apiClient.post<ApiSuccessResponse>('/keywords/update', data);
    },
};
