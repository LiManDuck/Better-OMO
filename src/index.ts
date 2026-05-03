/**
 * Better-OMO Plugin Entry Point
 */

import type { Plugin, PluginInput } from "@opencode-ai/plugin"
import { loadPluginConfig } from "./plugin-config"
import { createHooks } from "./hooks"
import { createDelegateTask } from "./tool/delegate-task"
import { createSlashcommandTool } from "./tool/slashcommand"
import { initializeBuiltinReminders } from "./system-reminder"
import { discoverAgents } from "./agent"

/**
 * Better-OMO Plugin
 *
 * A customized OpenCode plugin based on oh-my-opencode
 * with simplified architecture and improved maintainability
 */
const BetterOmoPlugin: Plugin = async (ctx: PluginInput) => {
  console.log("[Better-OMO] Plugin loading...", { directory: ctx.directory })

  // Initialize system reminders
  await initializeBuiltinReminders()
  console.log("[Better-OMO] System reminders initialized")

  // Load configuration
  const config = loadPluginConfig(ctx.directory)
  const disabledHooks = new Set(config.disabled_hooks ?? [])

  // Discover agents
  const agents = await discoverAgents()
  console.log(`[Better-OMO] Discovered ${agents.length} agents`)

  // Build hooks
  const hooks = createHooks(ctx, disabledHooks)

  // Build tools
  const tools = [
    createDelegateTask(ctx.client),
    createSlashcommandTool(),
  ]

  console.log("[Better-OMO] Plugin loaded successfully")

  return {
    ...hooks,
    agents,
    tools,
  }
}

export default BetterOmoPlugin
export { BetterOmoPlugin }
