/**
 * Centralized API client for the Audio Analysis Backend.
 *
 * - Prefixes all requests with `VITE_API_BASE_URL` (default: http://localhost:8000)
 * - Always sends `credentials: 'include'` for cookie-based auth
 * - Automatically sets `Content-Type: application/json` (skipped for FormData)
 * - Throws `ApiError` on non-OK responses with parsed error detail
 */

const API_BASE_URL =
    (import.meta as unknown as Record<string, Record<string, string>>).env?.VITE_API_BASE_URL ??
    '/api';

// ─── Error class ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly detail: string,
    ) {
        super(detail);
        this.name = 'ApiError';
    }
}

// ─── Internal helpers ──────────────────────────────────────────────────────────

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        let detail = `HTTP ${response.status}`;
        try {
            const body = await response.json();
            detail = body.detail ?? body.message ?? detail;
        } catch {
            // body wasn't JSON — use the status text
            detail = response.statusText || detail;
        }
        throw new ApiError(response.status, detail);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

function buildHeaders(isFormData: boolean): HeadersInit {
    if (isFormData) {
        // Let the browser set Content-Type with boundary for multipart/form-data
        return {};
    }
    return { 'Content-Type': 'application/json' };
}

// ─── Public API ────────────────────────────────────────────────────────────────

export const apiClient = {
    /**
     * Perform a GET request.
     */
    async get<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
        let url = `${API_BASE_URL}${endpoint}`;

        if (params) {
            const searchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(params)) {
                if (value !== undefined && value !== '') {
                    searchParams.append(key, String(value));
                }
            }
            const qs = searchParams.toString();
            if (qs) url += `?${qs}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: buildHeaders(false),
        });

        return handleResponse<T>(response);
    },

    /**
     * Perform a POST request with a JSON body.
     */
    async post<T>(endpoint: string, body?: unknown): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: buildHeaders(false),
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });

        return handleResponse<T>(response);
    },

    /**
     * Perform a POST request with FormData (for file uploads).
     */
    async postForm<T>(endpoint: string, formData: FormData): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            credentials: 'include',
            headers: buildHeaders(true),
            body: formData,
        });

        return handleResponse<T>(response);
    },

    /**
     * Perform a DELETE request.
     */
    async delete<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: buildHeaders(false),
        });

        return handleResponse<T>(response);
    },

    /**
     * Get the base URL (useful for constructing audio file URLs, etc.).
     */
    getBaseUrl(): string {
        return API_BASE_URL;
    },
};
