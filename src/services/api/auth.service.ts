import { apiClient } from '@/services/apiClient';
import type {
    LoginRequest,
    LoginResponse,
    UserInfo,
    ApiSuccessResponse,
} from '@/types/api.types';

export const authService = {
    /** Authenticate user and create session. */
    login(data: LoginRequest): Promise<LoginResponse> {
        return apiClient.post<LoginResponse>('/login', data);
    },

    /** Invalidate session and clear cookies. */
    logout(): Promise<ApiSuccessResponse> {
        return apiClient.post<ApiSuccessResponse>('/logout');
    },

    /** Retrieve current authenticated user information. */
    getCurrentUser(): Promise<UserInfo> {
        return apiClient.get<UserInfo>('/me');
    },
};
