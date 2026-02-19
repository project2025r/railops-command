import { apiClient } from '@/services/apiClient';
import type {
    CreateUserRequest,
    CreateUserResponse,
    UsersListResponse,
    DeleteUserResponse,
} from '@/types/api.types';

export const usersService = {
    /** Create new user account (Super Admin only). */
    createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
        return apiClient.post<CreateUserResponse>('/create-user', data);
    },

    /** Get all users (basic list, Super Admin only). */
    listUsers(): Promise<UsersListResponse> {
        return apiClient.get<UsersListResponse>('/list-users');
    },

    /** Get all users with detailed information (Super Admin only). */
    getUsers(): Promise<UsersListResponse> {
        return apiClient.get<UsersListResponse>('/users');
    },

    /** Delete a user account (Super Admin only). */
    deleteUser(userId: number): Promise<DeleteUserResponse> {
        return apiClient.delete<DeleteUserResponse>(`/delete-user/${userId}`);
    },
};
