/**
 * Event Handler Constants
 */

/**
 * Recoverable error types
 */
export const RECOVERABLE_ERROR_TYPES = [
  "context_length_exceeded",
  "rate_limit_exceeded",
  "timeout",
  "temporary_failure",
]

/**
 * Session recovery message
 */
export const SESSION_RECOVERY_MESSAGE = "Continue from previous context"

/**
 * Maximum retry attempts for session recovery
 */
export const MAX_RECOVERY_ATTEMPTS = 3

/**
 * Recovery delay in milliseconds
 */
export const RECOVERY_DELAY_MS = 1000
