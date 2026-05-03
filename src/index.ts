/**
 * Better-OMO Plugin Entry Point
 */

import type { Plugin, Hooks, PluginInput } from "@opencode-ai/plugin"
import { loadPluginConfig } from "./plugin-config"
import { createBuiltinAgents } from "./agent"
import { HOOK_NAMES } from "./constants"

/**
 * Better-OMO Plugin
 *
 * A customized OpenCode plugin based on oh-my-opencode
 * with simplified architecture and improved maintainability
 */
const BetterOmoPlugin: Plugin = async (ctx: PluginInput) => {
  console.log("[Better-OMO] Plugin loading...", { directory: ctx.directory })

  // Load configuration
  const config = loadPluginConfig(ctx.directory)
  const disabledHooks = new Set(config.disabled_hooks ?? [])

  // Check if hook is enabled
  const isHookEnabled = (hookName: string) => !disabledHooks.has(hookName as any)

  // Get default model
  const defaultModel = config.default_model ?? "anthropic/claude-sonnet-4-6"

  // Create built-in agents
  const _agents = createBuiltinAgents(defaultModel)

  // Build hooks
  const hooks: Hooks = {}

  // Event hook
  if (isHookEnabled("event")) {
    hooks.event = async ({ event }) => {
      console.log("[Better-OMO] Event:", event.type)

      // Handle specific events
      if (event.type === "session.created") {
        console.log("[Better-OMO] Session created")
      } else if (event.type === "session.deleted") {
        console.log("[Better-OMO] Session deleted")
      } else if (event.type === "session.error") {
        console.log("[Better-OMO] Session error")
      } else if (event.type === "message.updated") {
        console.log("[Better-OMO] Message updated")
      }
    }
  }

  // Config hook
  if (isHookEnabled("config")) {
    hooks.config = async () => {
      console.log("[Better-OMO] Config hook called")
      // Inject configuration into the system
    }
  }

  // Chat message hook
  if (isHookEnabled(HOOK_NAMES.CHAT_MESSAGE)) {
    hooks[HOOK_NAMES.CHAT_MESSAGE] = async (input) => {
      console.log("[Better-OMO] Chat message:", input.sessionID)
      // Process incoming messages
    }
  }

  // Tool execute before hook
  if (isHookEnabled(HOOK_NAMES.TOOL_EXECUTE_BEFORE)) {
    hooks[HOOK_NAMES.TOOL_EXECUTE_BEFORE] = async (input) => {
      console.log("[Better-OMO] Tool executing:", input.tool)
      // Pre-process tool execution
    }
  }

  // Tool execute after hook
  if (isHookEnabled(HOOK_NAMES.TOOL_EXECUTE_AFTER)) {
    hooks[HOOK_NAMES.TOOL_EXECUTE_AFTER] = async (input) => {
      console.log("[Better-OMO] Tool executed:", input.tool)
      // Post-process tool execution
    }
  }

  // Experimental chat messages transform
  if (isHookEnabled(HOOK_NAMES.EXPERIMENTAL_CHAT_MESSAGES_TRANSFORM)) {
    hooks[HOOK_NAMES.EXPERIMENTAL_CHAT_MESSAGES_TRANSFORM] = async () => {
      console.log("[Better-OMO] Transforming messages")
      // Transform messages before sending to LLM
    }
  }

  console.log("[Better-OMO] Plugin loaded successfully")

  return hooks
}

export default BetterOmoPlugin
export { BetterOmoPlugin }
