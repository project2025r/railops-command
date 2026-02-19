import { apiClient } from '@/services/apiClient';
import type {
    TranscriptSearchParams,
    TranscriptSearchResponse,
    TranscriptKpiParams,
    TranscriptKpiResponse,
    ViolationAnalysisParams,
    ViolationAnalysisResponse,
} from '@/types/api.types';

export const transcriptsService = {
    /** Search transcripts by keywords or filters. */
    searchTranscripts(params: TranscriptSearchParams): Promise<TranscriptSearchResponse> {
        return apiClient.get<TranscriptSearchResponse>('/transcripts/search', params as Record<string, string | number | undefined>);
    },

    /** Get Key Performance Indicators from transcripts. */
    getTranscriptKpi(params: TranscriptKpiParams): Promise<TranscriptKpiResponse> {
        return apiClient.get<TranscriptKpiResponse>('/transcript-kpi', params as Record<string, string | number | undefined>);
    },

    /** Analyze violations/keywords found in transcripts. */
    getViolationAnalysis(params: ViolationAnalysisParams): Promise<ViolationAnalysisResponse> {
        return apiClient.get<ViolationAnalysisResponse>('/violation-analysis', params as Record<string, string | number | undefined>);
    },
};
