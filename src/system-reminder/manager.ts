/**
 * System Reminder System
 *
 * Centralized system for injecting reminders into messages
 * based on specific conditions (tool execution, message processing, etc.)
 */

import type { Part, Message } from "@opencode-ai/sdk"

/**
 * Reminder trigger context
 */
export interface ReminderContext {
  /** Current session ID */
  sessionId?: string
  /** Tool being executed (if applicable) */
  tool?: string
  /** Tool input (if applicable) */
  toolInput?: Record<string, any>
  /** Tool output (if applicable) */
  toolOutput?: any
  /** Current message (if applicable) */
  message?: Message
  /** Additional metadata */
  metadata?: Record<string, any>
}

/**
 * Reminder result
 */
export interface ReminderResult {
  /** Whether to inject the reminder */
  shouldInject: boolean
  /** Reminder content to inject */
  content: string
  /** Priority (higher = more important) */
  priority?: number
}

/**
 * Reminder handler function
 */
export type ReminderHandler = (ctx: ReminderContext) => ReminderResult | Promise<ReminderResult>

/**
 * Registered reminder
 */
export interface RegisteredReminder {
  name: string
  description: string
  handler: ReminderHandler
  priority: number
  enabled: boolean
}

/**
 * System Reminder Manager
 */
export class SystemReminderManager {
  private reminders: Map<string, RegisteredReminder> = new Map()

  /**
   * Register a new reminder
   */
  register(
    name: string,
    description: string,
    handler: ReminderHandler,
    options?: { priority?: number; enabled?: boolean }
  ): void {
    this.reminders.set(name, {
      name,
      description,
      handler,
      priority: options?.priority ?? 0,
      enabled: options?.enabled ?? true,
    })
  }

  /**
   * Unregister a reminder
   */
  unregister(name: string): void {
    this.reminders.delete(name)
  }

  /**
   * Enable/disable a reminder
   */
  setEnabled(name: string, enabled: boolean): void {
    const reminder = this.reminders.get(name)
    if (reminder) {
      reminder.enabled = enabled
    }
  }

  /**
   * Generate all applicable reminders for a context
   */
  async generateReminders(ctx: ReminderContext): Promise<string[]> {
    const reminders: Array<{ content: string; priority: number }> = []

    for (const reminder of this.reminders.values()) {
      if (!reminder.enabled) continue

      try {
        const result = await reminder.handler(ctx)
        if (result.shouldInject) {
          reminders.push({
            content: result.content,
            priority: result.priority ?? reminder.priority,
          })
        }
      } catch (error) {
        console.error(`[SystemReminder] Error in reminder "${reminder.name}":`, error)
      }
    }

    // Sort by priority (higher first)
    reminders.sort((a, b) => b.priority - a.priority)

    return reminders.map(r => r.content)
  }

  /**
   * Inject reminders into message parts
   */
  async injectReminders(parts: Part[], ctx: ReminderContext): Promise<Part[]> {
    const reminders = await this.generateReminders(ctx)

    if (reminders.length === 0) {
      return parts
    }

    // Add reminders as a text part
    const reminderText = `\n\n---\n**System Reminders:**\n${reminders.map(r => `- ${r}`).join("\n")}`

    // Find last text part and append, or add new text part
    const lastPart = parts[parts.length - 1]
    if (lastPart && lastPart.type === "text") {
      // Append to existing text part
      const textPart = lastPart as any
      textPart.text += reminderText
    } else {
      // Add new text part - simplified structure
      parts.push({ type: "text", text: reminderText } as Part)
    }

    return parts
  }

  /**
   * List all registered reminders
   */
  list(): Array<{ name: string; description: string; enabled: boolean; priority: number }> {
    return Array.from(this.reminders.values()).map(r => ({
      name: r.name,
      description: r.description,
      enabled: r.enabled,
      priority: r.priority,
    }))
  }
}

/**
 * Global system reminder manager instance
 */
export const systemReminderManager = new SystemReminderManager()
