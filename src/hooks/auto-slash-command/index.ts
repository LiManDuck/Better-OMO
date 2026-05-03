/**
 * Auto Slash Command Hook
 *
 * Automatically suggests and executes slash commands based on context
 */

import type { PluginInput } from "@opencode-ai/plugin"
import type { Part, UserMessage } from "@opencode-ai/sdk"
import { discoverCommandsSync } from "../../tool/slashcommand"

/**
 * Auto slash command hook
 *
 * This hook analyzes user messages and suggests relevant slash commands
 */
export function createAutoSlashCommandHook(_ctx: PluginInput) {
  return async (_input: {
    sessionID: string
    agent?: string
    model?: { providerID: string; modelID: string }
    messageID?: string
    variant?: string
  }, output: { message: UserMessage; parts: Part[] }) => {
    const { parts } = output

    // Check if message starts with /
    const messageText = parts
      .filter((p): p is Part & { type: "text"; text: string } => p.type === "text")
      .map(p => p.text)
      .join("")

    if (!messageText.startsWith("/")) {
      return
    }

    // Parse command
    const parts2 = messageText.slice(1).split(/\s+/)
    const commandName = parts2[0]

    // Discover available commands
    const commands = discoverCommandsSync()
    const command = commands.find(c => c.name === commandName)

    if (!command) {
      console.log(`[AutoSlash] Command not found: ${commandName}`)
      return
    }

    console.log(`[AutoSlash] Detected command: /${commandName}`)

    // Command execution is handled by the slashcommand tool
    // This hook just logs and validates
  }
}
