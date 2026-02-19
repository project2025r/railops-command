import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { divisionsService } from '@/services/api';
import type { CreateDivisionRequest } from '@/types/api.types';

/** Query key constants for divisions. */
export const divisionKeys = {
    all: ['divisions'] as const,
};

/** Fetch all divisions. */
export function useDivisions() {
    return useQuery({
        queryKey: divisionKeys.all,
        queryFn: () => divisionsService.listDivisions(),
        staleTime: 5 * 60 * 1000, // 5 minutes — divisions rarely change
    });
}

/** Create a new division. Invalidates division list on success. */
export function useCreateDivision() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateDivisionRequest) => divisionsService.createDivision(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: divisionKeys.all });
        },
    });
}

/** Delete a division. Invalidates division list on success. */
export function useDeleteDivision() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (divisionId: number) => divisionsService.deleteDivision(divisionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: divisionKeys.all });
        },
    });
}
