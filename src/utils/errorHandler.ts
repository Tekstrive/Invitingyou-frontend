/**
 * Safely extracts an error message from an unknown error object
 * Handles axios errors, Error objects, and plain strings
 */
export function getErrorMessage(error: unknown): string {
  // Check if it's an axios error with response.data.message
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  // Check if it's a standard Error object
  if (error instanceof Error) {
    return error.message;
  }

  // Check if it's a string
  if (typeof error === "string") {
    return error;
  }

  // Fallback
  return "An unexpected error occurred";
}
