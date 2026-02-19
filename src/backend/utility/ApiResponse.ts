/**
 * ApiResponse utility for consistent API response structure
 */

interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
  timestamp?: string;
}

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
  message?: string;
  timestamp?: string;
}

type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

/**
 * Creates a success response
 * @param data - The data to return
 * @param message - Optional message
 * @returns SuccessResponse object
 */
export function createSuccessResponse<T = any>(
  data: T,
  message?: string
): SuccessResponse<T> {
  return {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Creates an error response
 * @param message - Error message
 * @param code - Optional error code
 * @param details - Optional error details
 * @param customMessage - Optional custom message to return to client
 * @returns ErrorResponse object
 */
export function createErrorResponse(
  message: string,
  code?: string,
  details?: any,
  customMessage?: string
): ErrorResponse {
  return {
    success: false,
    error: {
      message,
      code,
      details,
    },
    message: customMessage || message,
    timestamp: new Date().toISOString(),
  };
}

export type { ApiResponse, SuccessResponse, ErrorResponse };