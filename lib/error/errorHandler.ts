export class AIToolError extends Error {
    constructor(
        message: string,
        public code: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'AIToolError';
    }
}

export enum ErrorCode {
    EMBEDDING_FAILED = 'EMBEDDING_FAILED',
    SEARCH_FAILED = 'SEARCH_FAILED',
    AI_REQUEST_FAILED = 'AI_REQUEST_FAILED',
    CACHE_ERROR = 'CACHE_ERROR',
    INVALID_INPUT = 'INVALID_INPUT',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ErrorDetails {
    timestamp: number;
    requestId?: string;
    input?: unknown;
    stack?: string;
}

export const handleAIToolError = (error: unknown): string => {
    if (error instanceof AIToolError) {
        console.error(`AI Tool Error (${error.code}):`, error.message, error.details);
        return `An error occurred while processing your request: ${error.message}`;
    }

    if (error instanceof Error) {
        console.error('Unexpected error:', error);
        return `An unexpected error occurred: ${error.message}`;
    }

    console.error('Unknown error:', error);
    return 'An unexpected error occurred. Please try again.';
};

export const createErrorDetails = (
    input?: unknown,
    requestId?: string
): ErrorDetails => ({
    timestamp: Date.now(),
    requestId,
    input,
    stack: new Error().stack
});

export const isAIToolError = (error: unknown): error is AIToolError => {
    return error instanceof AIToolError;
};

export const throwAIToolError = (
    message: string,
    code: ErrorCode,
    details?: ErrorDetails
): never => {
    throw new AIToolError(message, code, details);
}; 