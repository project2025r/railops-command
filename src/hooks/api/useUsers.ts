import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/services/api';
import type { CreateUserRequest } from '@/types/api.types';

/** Query key constants for users. */
export const userKeys = {
    all: ['users'] as const,
};

/** Fetch all users via /list-users. */
export function useUsers() {
    return useQuery({
        queryKey: userKeys.all,
        queryFn: () => usersService.listUsers(),
    });
}

/** Create a new user. Invalidates user list on success. */
export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateUserRequest) => usersService.createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}

/** Delete a user. Invalidates user list on success. */
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: number) => usersService.deleteUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}
