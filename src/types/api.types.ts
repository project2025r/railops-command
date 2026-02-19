// ─── Authentication ────────────────────────────────────────────────────────────

export interface LoginRequest {
    username: string;
    password: string;
    division?: string;
}

export interface LoginResponse {
    success: boolean;
    username: string;
    is_admin: boolean;
    is_super_admin: boolean;
    division: string | null;
}

export interface UserInfo {
    id: number;
    username: string;
    is_admin: boolean;
    is_super_admin: boolean;
    division: string | null;
    last_loggedin: string | null;
}

// ─── User Management ───────────────────────────────────────────────────────────

export interface CreateUserRequest {
    username: string;
    password: string;
    division?: string;
}

export interface CreateUserResponse {
    success: boolean;
    user_id: number;
    message: string;
}

export interface UserDetail {
    id: number;
    username: string;
    division: string | null;
    is_admin: boolean;
    is_super_admin: boolean;
    created_at?: string;
    last_loggedin: string | null;
    original_password?: string;
}

export interface UsersListResponse {
    users: UserDetail[];
    total: number;
}

export interface DeleteUserResponse {
    success: boolean;
    message: string;
}

// ─── Divisions ─────────────────────────────────────────────────────────────────

export interface Division {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
}

export interface DivisionListResponse {
    divisions: Division[];
    total: number;
}

export interface CreateDivisionRequest {
    division_name: string;
    description?: string;
}

export interface CreateDivisionResponse {
    success: boolean;
    division_id: number;
    message: string;
}

export interface DeleteDivisionResponse {
    success: boolean;
    message: string;
}

// ─── Files ─────────────────────────────────────────────────────────────────────

export interface FileListResponse {
    files: string[];
    source: 'database' | 's3' | 's3_fallback';
}

export interface DatabaseFile {
    id: number;
    file_name: string;
    division: string;
    file_size: number;
    uploaded_at: string;
}

export interface DatabaseFilesResponse {
    files: DatabaseFile[];
    total: number;
}

export interface FileContentResponse {
    filename: string;
    data: Record<string, unknown>[];
}

export interface DatabaseFileContentResponse {
    data: Record<string, unknown>[];
    pagination: {
        page: number;
        per_page: number;
        total: number;
    };
}

export interface CombinedFile {
    file_name: string;
    division: string;
    row_count: number;
}

export interface CombinedFilesResponse {
    files: CombinedFile[];
    total_rows: number;
}

export interface CombinedFileContentResponse {
    data: Array<{
        file_name: string;
        row_data: Record<string, unknown>;
    }>;
    total_records: number;
}

// ─── Transcripts & Search ──────────────────────────────────────────────────────

export interface TranscriptSearchParams {
    keyword?: string;
    division?: string;
    loco_pilot?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    limit?: number;
}

export interface TranscriptSearchResult {
    id: number;
    file_name: string;
    matched_text: string;
    timestamp: string;
    division: string;
}

export interface TranscriptSearchResponse {
    results: TranscriptSearchResult[];
    total: number;
    page: number;
    total_pages: number;
}

export interface TranscriptKpiParams {
    division?: string;
    start_date?: string;
    end_date?: string;
    loco_pilot?: string;
    section?: string;
}

export interface TranscriptKpiResponse {
    total_files: number;
    total_keywords_found: number;
    breakdown_by_keyword: Record<string, number>;
    breakdown_by_loco_pilot: Record<string, number>;
    breakdown_by_section: Record<string, number>;
    breakdown_by_loco_number: Record<string, number>;
}

export interface ViolationAnalysisParams {
    division?: string;
    keyword?: string;
    start_date?: string;
    end_date?: string;
}

export interface ViolationDetail {
    file_name: string;
    keyword: string;
    line_number: number;
    context: string;
}

export interface ViolationAnalysisResponse {
    violation_summary: {
        total_violations: number;
        by_keyword: Record<string, number>;
        by_loco_pilot: Record<string, number>;
    };
    detailed_violations: ViolationDetail[];
}

// ─── Dashboard & Analytics ─────────────────────────────────────────────────────

export interface DashboardDataParams {
    division?: string;
    start_date?: string;
    end_date?: string;
    loco_pilot?: string;
}

export interface DashboardDataResponse {
    total_files: number;
    total_records: number;
    keywords_found: number;
    charts_data: {
        by_division: Record<string, unknown>;
        by_loco_pilot: Record<string, unknown>;
        by_date: Record<string, unknown>;
        keyword_distribution: Record<string, unknown>;
    };
    top_performers: unknown[];
    recent_activity: unknown[];
}

export interface DatabaseStatsResponse {
    total_transcripts: number;
    total_files: number;
    date_range: {
        earliest: string;
        latest: string;
    };
    divisions_count: number;
    by_division: Record<string, number>;
}

// ─── Admin ─────────────────────────────────────────────────────────────────────

export interface AdminFileCountsParams {
    division?: string;
    start_date?: string;
    end_date?: string;
}

export interface AdminFileCountsResponse {
    total_files: number;
    by_division: Record<string, number>;
    by_date: Record<string, number>;
}

export interface RealTimeFileCountsResponse {
    total_files: number;
    files_today: number;
    pending_ingestion: number;
    by_division: Record<string, {
        total: number;
        today: number;
    }>;
}

export interface AutoSyncStatusResponse {
    is_running: boolean;
    last_sync: string | null;
    next_sync: string | null;
}

export interface IngestionStatusResponse {
    status: 'idle' | 'processing' | 'completed' | 'failed';
    files_processed: number;
    files_pending: number;
    last_update: string;
}

// ─── Upload ────────────────────────────────────────────────────────────────────

export interface UploadAudioResponse {
    success: boolean;
    file_name: string;
    size: number;
    message: string;
}

export interface UploadAudioWithMetadataResponse {
    success: boolean;
    file_name: string;
    metadata: Record<string, string>;
    message: string;
}

export interface UploadHistoryItem {
    id: number;
    file_name: string;
    upload_date: string;
    division: string;
    status: 'success' | 'failed';
}

export interface UploadHistoryResponse {
    uploads: UploadHistoryItem[];
    total: number;
}

// ─── Dropdown Data ─────────────────────────────────────────────────────────────

export interface DropdownDataResponse {
    divisions: string[];
    loco_pilots: string[];
    sections: string[];
    designations: string[];
}

export interface LpAlpSectionDataResponse {
    loco_pilots: string[];
    alps: string[];
    sections: string[];
}

export interface LpAlpSectionCombination {
    loco_pilot: string;
    alp: string;
    section: string;
}

export interface LpAlpSectionCombinationsResponse {
    combinations: LpAlpSectionCombination[];
    total: number;
}

// ─── Keywords ──────────────────────────────────────────────────────────────────

export interface Keyword {
    id: number;
    keyword: string;
    category: string;
    is_active: boolean;
    created_at: string;
}

export interface KeywordsResponse {
    keywords: Keyword[];
    total: number;
}

export interface AddKeywordRequest {
    keyword: string;
    category?: string;
    is_active: boolean;
}

export interface UpdateKeywordRequest {
    keyword_id: number;
    keyword: string;
    category: string;
    is_active: boolean;
}

// ─── Loco Pilot Files ──────────────────────────────────────────────────────────

export interface LpFileItem {
    file_name: string;
    upload_date: string;
    division: string;
    records_count: number;
}

export interface LpFilesResponse {
    lp_name: string;
    files: LpFileItem[];
    total_files: number;
    total_records: number;
}

// ─── Utility ───────────────────────────────────────────────────────────────────

export interface TestParsingResponse {
    filename: string;
    parsed_data: {
        division: string;
        date: string;
        time: string;
        train_number: string;
        loco_number: string;
        loco_pilot: string;
        alp_name: string;
        designation: string;
        hq: string;
        section: string;
    };
}

export interface ApiSuccessResponse {
    success: boolean;
    message: string;
}

export interface ApiErrorResponse {
    detail: string;
}
