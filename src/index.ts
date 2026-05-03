/**
 * Better-OMO Plugin Entry Point
 */

import type { Plugin, PluginInput, Hooks } from "@opencode-ai/plugin"
import type { Event } from "@opencode-ai/sdk"
import { loadPluginConfig } from "./plugin-config"
import { createHooks } from "./hooks"
import { createDelegateTask } from "./tool/delegate-task"
import { createSlashcommandTool } from "./tool/slashcommand"
import { initializeBuiltinReminders } from "./system-reminder"
import { discoverAgents } from "./agent"
import { TmuxSessionManager } from "./utils/tmux"
import type { TmuxConfig } from "./config/schema"

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

  // Initialize TMUX manager
  const tmuxConfig: TmuxConfig = config.tmux ?? {
    enabled: false,
    layout: "main-vertical",
    main_pane_size: 60,
  }
  const tmuxManager = new TmuxSessionManager(ctx, tmuxConfig)
  console.log(`[Better-OMO] TMUX manager initialized (enabled: ${tmuxConfig.enabled})`)

  // Build hooks
  const baseHooks = createHooks(ctx, disabledHooks)

  // Build event hook with TMUX integration
  const eventHook: Hooks["event"] = async ({ event }: { event: Event }) => {
    // Call base event hooks first
    if (baseHooks.event) {
      await baseHooks.event({ event })
    }

    // Handle TMUX-related events
    if (event.type === "session.created") {
      const properties = (event as any).properties
      await tmuxManager.onSessionCreated({
        sessionID: properties.sessionID,
        parentID: properties.parentID,
        title: properties.title || "New Session",
      })
    } else if (event.type === "session.deleted") {
      const properties = (event as any).properties
      await tmuxManager.onSessionDeleted({
        sessionID: properties.sessionID,
      })
    }
  }

  // Build tools
  const tools = [
    createDelegateTask(ctx.client),
    createSlashcommandTool(),
  ]

  console.log("[Better-OMO] Plugin loaded successfully")

  return {
    ...baseHooks,
    event: eventHook,
    agents,
    tools,
  }
}

export default BetterOmoPlugin
export { BetterOmoPlugin }
