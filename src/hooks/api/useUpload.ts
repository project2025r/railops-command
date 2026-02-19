import { useQuery, useMutation } from '@tanstack/react-query';
import { uploadService } from '@/services/api';

/** Query key constants for upload-related data. */
export const uploadKeys = {
    dropdownData: (division?: string) => ['upload', 'dropdown', division] as const,
    uploadHistory: (limit?: number) => ['upload', 'history', limit] as const,
};

/** Fetch dropdown data for upload forms (LP names, ALP names, sections, etc.). */
export function useDropdownData(division?: string) {
    return useQuery({
        queryKey: uploadKeys.dropdownData(division),
        queryFn: () => uploadService.getDropdownData(division),
        staleTime: 5 * 60 * 1000,
    });
}

/** Upload audio with metadata. */
export function useUploadAudio() {
    return useMutation({
        mutationFn: ({
            file,
            metadata,
        }: {
            file: File;
            metadata: {
                division: string;
                train_number?: string;
                loco_number?: string;
                loco_pilot?: string;
                alp_name?: string;
                section?: string;
                designation?: string;
            };
        }) => uploadService.uploadAudioWithMetadata(file, metadata),
    });
}

/** Fetch upload history. */
export function useUploadHistory(limit?: number) {
    return useQuery({
        queryKey: uploadKeys.uploadHistory(limit),
        queryFn: () => uploadService.getUploadHistory(limit),
    });
}
