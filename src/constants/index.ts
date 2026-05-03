/**
 * Centralized constants for Better-OMO
 * All constants should be defined here to prevent scattered definitions
 */

/**
 * Hook names that Better-OMO uses
 */
export const HOOK_NAMES = {
  // Chat hooks
  CHAT_MESSAGE: "chat.message",
  CHAT_PARAMS: "chat.params",
  CHAT_HEADERS: "chat.headers",

  // Tool hooks
  TOOL_EXECUTE_BEFORE: "tool.execute.before",
  TOOL_EXECUTE_AFTER: "tool.execute.after",
  TOOL_DEFINITION: "tool.definition",

  // Command hooks
  COMMAND_EXECUTE_BEFORE: "command.execute.before",

  // Shell hooks
  SHELL_ENV: "shell.env",

  // Permission hooks
  PERMISSION_ASK: "permission.ask",

  // Experimental hooks
  EXPERIMENTAL_CHAT_MESSAGES_TRANSFORM: "experimental.chat.messages.transform",
  EXPERIMENTAL_CHAT_SYSTEM_TRANSFORM: "experimental.chat.system.transform",
  EXPERIMENTAL_SESSION_COMPACTING: "experimental.session.compacting",
  EXPERIMENTAL_COMPACTION_AUTOCONTINUE: "experimental.compaction.autocontinue",
  EXPERIMENTAL_TEXT_COMPLETE: "experimental.text.complete",

  // Config hook
  CONFIG: "config",
  EVENT: "event",
} as const

/**
 * Event types
 */
export const EVENT_TYPES = {
  SESSION_ERROR: "session.error",
  SESSION_CREATED: "session.created",
  SESSION_DELETED: "session.deleted",
  MESSAGE_UPDATED: "message.updated",
} as const

/**
 * Tool names
 */
export const TOOL_NAMES = {
  BASH: "bash",
  READ: "read",
  WRITE: "write",
  EDIT: "edit",
  DELEGATE_TASK: "delegate_task",
  SLASH_COMMAND: "slashcommand",
  TASK: "task",
  TODO_WRITE: "todowrite",
  TODO_READ: "todoread",
} as const

/**
 * Agent names
 */
export const AGENT_NAMES = {
  MAIN: "main",
  EXPLORE: "explore",
  GENERAL: "general",
  LOOK_AT: "look-at",
  CLAUDE_CODE: "claude-code",
  CLAWCODER: "clawcoder",
  AUTOSE: "autose",
} as const

/**
 * Default agent prompts
 */
export const AGENT_PROMPTS = {
  MAIN: "you are bt-omo, a good code agent",
  EXPLORE: "You are an exploration agent with read-only permissions.",
  GENERAL: "You are a general-purpose agent with all capabilities.",
  LOOK_AT: "You are a multimodal agent for visual analysis.",
  CLAUDE_CODE: "You are Claude Code, an AI coding assistant.",
} as const

/**
 * Shell types
 */
export const SHELL_TYPES = {
  UNIX: "unix",
  CMD: "cmd",
  POWERSHELL: "powershell",
} as const

/**
 * Config file paths
 */
export const CONFIG_PATHS = {
  USER_CONFIG: "~/.config/opencode/bt-omo.json",
  PROJECT_CONFIG: "./bt-omo.json",
} as const

/**
 * Default values
 */
export const DEFAULTS = {
  FORK_CONTEXT: true,
  TMUX_ENABLED: false,
  TMUX_LAYOUT: "main-vertical",
  TMUX_MAIN_PANE_SIZE: 60,
} as const
