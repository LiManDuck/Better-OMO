/**
 * Bash Tool Reminders
 *
 * System reminders for bash tool execution
 */

import type { ReminderHandler } from "../manager"

/**
 * Detect shell type from environment
 */
function detectShellType(): "unix" | "cmd" | "powershell" {
  const platform = process.platform
  const shell = process.env.SHELL || process.env.ComSpec || ""

  if (platform === "win32") {
    if (shell.toLowerCase().includes("powershell") || shell.toLowerCase().includes("pwsh")) {
      return "powershell"
    }
    return "cmd"
  }

  return "unix"
}

/**
 * Get shell version info
 */
function getShellVersion(): string {
  const shellType = detectShellType()

  try {
    if (shellType === "unix") {
      return `Shell: ${process.env.SHELL || "bash"}`
    } else if (shellType === "powershell") {
      return "Shell: PowerShell"
    } else {
      return "Shell: Windows CMD"
    }
  } catch {
    return `Shell: ${shellType}`
  }
}

/**
 * Check if command is dangerous
 */
function isDangerousCommand(command: string): boolean {
  const dangerousPatterns = [
    /\brm\s+-rf\b/,
    /\brm\s+--no-preserve-root\b/,
    /\bdd\s+if=/,
    /\bmkfs\b/,
    /\bformat\b/i,
    /\bdel\s+\/[sS]/,
    /\brmdir\s+\/[sS]/,
    />\s*\/dev\/sd/,
    /\bchmod\s+[-+]rwx\s+\/\b/,
    /\bchown\s+.*\s+\/\b/,
  ]

  return dangerousPatterns.some(pattern => pattern.test(command))
}

/**
 * Check if command involves file operations
 */
function isFileOperation(command: string): boolean {
  const fileOpPatterns = [
    /\bcp\b/,
    /\bmv\b/,
    /\bmkdir\b/,
    /\btouch\b/,
    /\bcat\s+>/,
    /\btee\b/,
  ]

  return fileOpPatterns.some(pattern => pattern.test(command))
}

/**
 * Reminder: Bash version on failure
 */
export const bashFailureReminder: ReminderHandler = (ctx) => {
  // Only for bash tool
  if (ctx.tool !== "bash") {
    return { shouldInject: false, content: "" }
  }

  const output = ctx.toolOutput?.output
  const exitCode = ctx.toolOutput?.metadata?.exitCode

  // Check for failure or empty output
  const hasError = exitCode !== 0 || !output || output.trim() === ""

  if (!hasError) {
    return { shouldInject: false, content: "" }
  }

  const shellInfo = getShellVersion()

  return {
    shouldInject: true,
    content: `Bash command failed. ${shellInfo}. Check command syntax for your shell type.`,
    priority: 10,
  }
}

/**
 * Reminder: File operation confirmation
 */
export const fileOperationReminder: ReminderHandler = (ctx) => {
  // Only for bash tool
  if (ctx.tool !== "bash") {
    return { shouldInject: false, content: "" }
  }

  const command = ctx.toolInput?.command
  if (!command || typeof command !== "string") {
    return { shouldInject: false, content: "" }
  }

  if (!isFileOperation(command)) {
    return { shouldInject: false, content: "" }
  }

  return {
    shouldInject: true,
    content: "File operation detected. Verify paths and permissions before execution.",
    priority: 5,
  }
}

/**
 * Reminder: Dangerous command warning
 */
export const dangerousCommandReminder: ReminderHandler = (ctx) => {
  // Only for bash tool
  if (ctx.tool !== "bash") {
    return { shouldInject: false, content: "" }
  }

  const command = ctx.toolInput?.command
  if (!command || typeof command !== "string") {
    return { shouldInject: false, content: "" }
  }

  if (!isDangerousCommand(command)) {
    return { shouldInject: false, content: "" }
  }

  return {
    shouldInject: true,
    content: "⚠️ DANGEROUS COMMAND DETECTED. This operation may cause irreversible data loss. Please confirm carefully.",
    priority: 100,
  }
}

/**
 * Register all bash tool reminders
 */
export function registerBashReminders(manager: import("../manager").SystemReminderManager): void {
  manager.register("bash-failure", "Remind about bash version on command failure", bashFailureReminder, { priority: 10 })
  manager.register("file-operation", "Remind about file operation safety", fileOperationReminder, { priority: 5 })
  manager.register("dangerous-command", "Warn about dangerous commands", dangerousCommandReminder, { priority: 100 })
}
