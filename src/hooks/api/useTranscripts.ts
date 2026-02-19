import { useQuery } from '@tanstack/react-query';
import { transcriptsService, filesService } from '@/services/api';
import type { TranscriptSearchParams } from '@/types/api.types';
import { uploadService } from '@/services/api';

/** Query key constants for transcripts. */
export const transcriptKeys = {
    search: (params: TranscriptSearchParams) => ['transcripts', 'search', params] as const,
    databaseFiles: (division?: string) => ['transcripts', 'databaseFiles', division] as const,
};

/** Search transcripts. Only runs when keyword or other search params are set. */
export function useTranscriptSearch(params: TranscriptSearchParams, enabled = true) {
    return useQuery({
        queryKey: transcriptKeys.search(params),
        queryFn: () => transcriptsService.searchTranscripts(params),
        enabled,
    });
}

/** Fetch database files (for file picker in transcript view). */
export function useDatabaseFiles(division?: string) {
    return useQuery({
        queryKey: transcriptKeys.databaseFiles(division),
        queryFn: () => filesService.getDatabaseFiles(division),
    });
}

/** Get an audio file URL for playback. This is not a hook — just a helper. */
export function getAudioFileUrl(fileId?: number, filename?: string): string {
    return uploadService.getAudioFileUrl(fileId, filename);
}
