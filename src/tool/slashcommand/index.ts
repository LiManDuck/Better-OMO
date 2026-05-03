/**
 * Slashcommand Tool Implementation
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin"
import { existsSync, readdirSync, readFileSync } from "fs"
import { join, basename } from "path"
import { homedir } from "os"
import type { CommandInfo, CommandMetadata, SlashcommandToolOptions } from "./types"

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter<T = Record<string, any>>(content: string): { data: T; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { data: {} as T, body: content }
  }

  const frontmatterLines = match[1].split("\n")
  const data: Record<string, any> = {}

  for (const line of frontmatterLines) {
    const colonIndex = line.indexOf(":")
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      const value = line.slice(colonIndex + 1).trim()
      data[key] = value
    }
  }

  return { data: data as T, body: match[2] }
}

/**
 * Check if file is a markdown file
 */
function isMarkdownFile(entry: { isFile(): boolean; name: string }): boolean {
  return entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))
}

/**
 * Discover commands from a directory
 */
function discoverCommandsFromDir(commandsDir: string, scope: CommandInfo['scope']): CommandInfo[] {
  if (!existsSync(commandsDir)) {
    return []
  }

  const entries = readdirSync(commandsDir, { withFileTypes: true })
  const commands: CommandInfo[] = []

  for (const entry of entries) {
    if (!isMarkdownFile(entry)) continue

    const commandPath = join(commandsDir, entry.name)
    const commandName = basename(entry.name, ".md")

    try {
      const content = readFileSync(commandPath, "utf-8")
      const { data, body } = parseFrontmatter(content)

      const metadata: CommandMetadata = {
        name: commandName,
        description: data.description || "",
        argumentHint: data["argument-hint"],
        model: data.model,
        agent: data.agent,
        subtask: Boolean(data.subtask),
      }

      commands.push({
        name: commandName,
        path: commandPath,
        metadata,
        content: body,
        scope,
      })
    } catch {
      continue
    }
  }

  return commands
}

/**
 * Discover all available commands
 */
export function discoverCommandsSync(): CommandInfo[] {
  const configDir = join(homedir(), ".config", "opencode")
  const userCommandsDir = join(homedir(), ".claude", "commands")
  const projectCommandsDir = join(process.cwd(), ".claude", "commands")
  const opencodeGlobalDir = join(configDir, "command")
  const opencodeProjectDir = join(process.cwd(), ".opencode", "command")

  const userCommands = discoverCommandsFromDir(userCommandsDir, "user")
  const opencodeGlobalCommands = discoverCommandsFromDir(opencodeGlobalDir, "opencode")
  const projectCommands = discoverCommandsFromDir(projectCommandsDir, "project")
  const opencodeProjectCommands = discoverCommandsFromDir(opencodeProjectDir, "opencode-project")

  return [...opencodeProjectCommands, ...projectCommands, ...opencodeGlobalCommands, ...userCommands]
}

/**
 * Format command list for display
 */
function formatCommandList(items: CommandInfo[]): string {
  if (items.length === 0) {
    return "No commands found."
  }

  const lines = ["# Available Commands\n"]

  // Group by scope
  const grouped = items.reduce((acc, cmd) => {
    if (!acc[cmd.scope]) acc[cmd.scope] = []
    acc[cmd.scope].push(cmd)
    return acc
  }, {} as Record<string, CommandInfo[]>)

  for (const [scope, commands] of Object.entries(grouped)) {
    lines.push(`\n## ${scope.charAt(0).toUpperCase() + scope.slice(1)} Commands\n`)
    for (const cmd of commands) {
      const desc = cmd.metadata.description ? ` - ${cmd.metadata.description}` : ""
      lines.push(`- /${cmd.name}${desc}`)
    }
  }

  return lines.join("\n")
}

/**
 * Format a single command for display
 */
function formatCommand(cmd: CommandInfo): string {
  const sections: string[] = []

  sections.push(`# /${cmd.name} Command\n`)

  if (cmd.metadata.description) {
    sections.push(`**Description**: ${cmd.metadata.description}\n`)
  }

  if (cmd.metadata.argumentHint) {
    sections.push(`**Usage**: /${cmd.name} ${cmd.metadata.argumentHint}\n`)
  }

  if (cmd.metadata.model) {
    sections.push(`**Model**: ${cmd.metadata.model}\n`)
  }

  if (cmd.metadata.agent) {
    sections.push(`**Agent**: ${cmd.metadata.agent}\n`)
  }

  sections.push(`**Scope**: ${cmd.scope}\n`)
  sections.push("---\n")
  sections.push("## Command Instructions\n")
  sections.push(cmd.content || "")

  return sections.join("\n")
}

/**
 * Create slashcommand tool
 */
export function createSlashcommandTool(options?: SlashcommandToolOptions): ToolDefinition {
  const commands = options?.commands ?? discoverCommandsSync()

  return tool({
    description: "Execute a slash command or list available commands. Commands are loaded from multiple sources: project, user, and global config directories.",
    args: {
      command: tool.schema.string().optional().describe("Command name to execute (without / prefix). Leave empty to list all commands."),
      arguments: tool.schema.string().optional().describe("Arguments to pass to the command"),
    },
    async execute(args) {
      const { command, arguments: cmdArgs } = args

      // No command specified - list all commands
      if (!command) {
        return {
          output: formatCommandList(commands),
          metadata: { commandCount: commands.length },
        }
      }

      // Find the command
      const cmd = commands.find(c => c.name === command)
      if (!cmd) {
        return {
          output: `Command /${command} not found.\n\nUse this tool without arguments to see available commands.`,
          metadata: { error: true },
        }
      }

      // Format command for execution
      let output = formatCommand(cmd)

      if (cmdArgs) {
        output += `\n\n## Arguments\n${cmdArgs}`
      }

      return {
        output,
        metadata: {
          command: cmd.name,
          scope: cmd.scope,
          model: cmd.metadata.model,
          agent: cmd.metadata.agent,
        },
      }
    },
  })
}
