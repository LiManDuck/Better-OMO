/**
 * System Reminder Module
 *
 * Exports the system reminder manager and built-in reminders
 */

export { SystemReminderManager, systemReminderManager } from "./manager"
export type { ReminderContext, ReminderResult, ReminderHandler, RegisteredReminder } from "./manager"
export { registerBashReminders, bashFailureReminder, fileOperationReminder, dangerousCommandReminder } from "./reminders/bash"

/**
 * Initialize all built-in reminders
 */
export async function initializeBuiltinReminders(): Promise<void> {
  const { systemReminderManager } = await import("./manager")
  const { registerBashReminders } = await import("./reminders/bash")

  // Register bash reminders
  registerBashReminders(systemReminderManager)

  console.log("[SystemReminder] Built-in reminders initialized")
}
