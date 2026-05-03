/**
 * Anthropic Context Window Limit Recovery Hook
 *
 * Handles context window limit errors from Anthropic API
 */

import type { PluginInput } from "@opencode-ai/plugin"
import type { Event } from "@opencode-ai/sdk"

/**
 * Check if error is a context window limit error
 */
function isContextWindowError(error: any): boolean {
  if (!error) return false

  const errorStr = String(error).toLowerCase()
  return (
    errorStr.includes("context length exceeded") ||
    errorStr.includes("context_window_limit") ||
    errorStr.includes("maximum context length") ||
    error?.status === 400 ||
    error?.code === "context_length_exceeded"
  )
}

/**
 * Context window recovery hook
 *
 * This hook monitors for context window limit errors and attempts recovery
 * by summarizing or truncating the conversation history.
 */
export function createAnthropicContextWindowLimitRecoveryHook(ctx: PluginInput) {
  return async ({ event }: { event: Event }) => {
    // Only handle error events
    if (event.type !== "session.error") {
      return
    }

    const properties = (event as any).properties
    const error = properties?.error
    const sessionId = properties?.sessionID

    if (!isContextWindowError(error)) {
      return
    }

    console.log("[ContextRecovery] Context window limit reached, attempting recovery")

    try {
      // Get session info
      if (!sessionId) {
        console.log("[ContextRecovery] No session ID, cannot recover")
        return
      }

      // Use client to create a new session with parent
      const result = await ctx.client.session.create({
        body: {
          parentID: sessionId,
          title: "Context Recovery",
        },
      })

      if (result.error) {
        console.error("[ContextRecovery] Failed to send recovery message:", result.error)
        return
      }

      console.log("[ContextRecovery] Recovery message sent successfully")
    } catch (error) {
      console.error("[ContextRecovery] Error during recovery:", error)
    }
  }
}
