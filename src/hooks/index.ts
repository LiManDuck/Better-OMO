/**
 * Better-OMO Hooks
 *
 * Export all hooks for the plugin
 */

export { createAnthropicContextWindowLimitRecoveryHook } from "./anthropic-context-window-limit-recovery"
export { createAutoSlashCommandHook } from "./auto-slash-command"

import type { PluginInput, Hooks } from "@opencode-ai/plugin"
import { createAnthropicContextWindowLimitRecoveryHook } from "./anthropic-context-window-limit-recovery"
import { createAutoSlashCommandHook } from "./auto-slash-command"

/**
 * Create all hooks for the plugin
 */
export function createHooks(ctx: PluginInput, disabledHooks: Set<string>): Hooks {
  const hooks: Hooks = {}

  // Event hook
  if (!disabledHooks.has("event")) {
    const contextRecovery = createAnthropicContextWindowLimitRecoveryHook(ctx)

    hooks.event = async ({ event }) => {
      // Context window recovery
      if (event.type === "session.error") {
        await contextRecovery({ event })
      }
    }
  }

  // Chat message hook
  if (!disabledHooks.has("chat.message")) {
    const autoSlashCommand = createAutoSlashCommandHook(ctx)

    hooks["chat.message"] = async (input, output) => {
      await autoSlashCommand(input, output)
    }
  }

  return hooks
}
