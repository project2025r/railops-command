import { apiClient } from '@/services/apiClient';
import type {
    DivisionListResponse,
    CreateDivisionRequest,
    CreateDivisionResponse,
    DeleteDivisionResponse,
} from '@/types/api.types';

export const divisionsService = {
    /** Get all divisions. */
    listDivisions(): Promise<DivisionListResponse> {
        return apiClient.get<DivisionListResponse>('/list-divisions');
    },

    /** Create a new division (Super Admin only). */
    createDivision(data: CreateDivisionRequest): Promise<CreateDivisionResponse> {
        return apiClient.post<CreateDivisionResponse>('/create-division', data);
    },

    /** Delete a division (Super Admin only). */
    deleteDivision(divisionId: number): Promise<DeleteDivisionResponse> {
        return apiClient.delete<DeleteDivisionResponse>(`/delete-division/${divisionId}`);
    },
};
