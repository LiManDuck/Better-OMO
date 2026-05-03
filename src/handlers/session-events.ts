/**
 * Session Event Handlers
 *
 * Handles various session events with recovery and cleanup logic
 */

import type { PluginInput } from "@opencode-ai/plugin"
import type { Event } from "@opencode-ai/sdk"
import { TmuxSessionManager } from "../utils/tmux"
import { RECOVERABLE_ERROR_TYPES, MAX_RECOVERY_ATTEMPTS } from "../constants/event"

/**
 * Session state tracker
 */
interface SessionState {
  sessionId: string
  parentId?: string
  agent?: string
  retryCount: number
  createdAt: Date
}

/**
 * Session Event Handler
 *
 * Handles session lifecycle events with proper state management
 */
export class SessionEventHandler {
  private ctx: PluginInput
  private tmuxManager: TmuxSessionManager
  private sessions: Map<string, SessionState> = new Map()

  constructor(ctx: PluginInput, tmuxManager: TmuxSessionManager) {
    this.ctx = ctx
    this.tmuxManager = tmuxManager
  }

  /**
   * Handle session.error event
   */
  async handleSessionError(event: Event): Promise<void> {
    if (event.type !== "session.error") return

    const properties = (event as any).properties
    const sessionId = properties?.sessionID
    const error = properties?.error

    if (!sessionId) return

    const sessionState = this.sessions.get(sessionId)
    if (!sessionState) return

    // Check if error is recoverable
    const errorType = error?.type || error?.code || ""
    const isRecoverable = RECOVERABLE_ERROR_TYPES.some(type =>
      errorType.toLowerCase().includes(type.toLowerCase())
    )

    if (!isRecoverable) {
      console.log(`[EventHandler] Non-recoverable error for session ${sessionId}`)
      return
    }

    // Check retry count
    if (sessionState.retryCount >= MAX_RECOVERY_ATTEMPTS) {
      console.log(`[EventHandler] Max recovery attempts reached for session ${sessionId}`)
      return
    }

    sessionState.retryCount++

    console.log(
      `[EventHandler] Attempting recovery for session ${sessionId} (attempt ${sessionState.retryCount}/${MAX_RECOVERY_ATTEMPTS})`
    )

    try {
      // Create a new session with parent reference
      const result = await this.ctx.client.session.create({
        body: {
          parentID: sessionState.parentId,
          title: `Recovery: ${sessionState.agent || "Session"}`,
        },
      })

      if (result.error) {
        console.error(`[EventHandler] Failed to create recovery session:`, result.error)
        return
      }

      console.log(`[EventHandler] Recovery session created: ${result.data.id}`)
    } catch (error) {
      console.error(`[EventHandler] Error during recovery:`, error)
    }
  }

  /**
   * Handle message.updated event
   */
  async handleMessageUpdated(event: Event): Promise<void> {
    if (event.type !== "message.updated") return

    const properties = (event as any).properties
    const sessionId = properties?.sessionID
    const info = properties?.info

    if (!sessionId) return

    const sessionState = this.sessions.get(sessionId)
    if (!sessionState) return

    // Update agent name if provided
    if (info?.agent) {
      sessionState.agent = info.agent
      console.log(`[EventHandler] Session ${sessionId} agent updated to: ${info.agent}`)
    }
  }

  /**
   * Handle session.deleted event
   */
  async handleSessionDeleted(event: Event): Promise<void> {
    if (event.type !== "session.deleted") return

    const properties = (event as any).properties
    const sessionId = properties?.sessionID

    if (!sessionId) return

    console.log(`[EventHandler] Session deleted: ${sessionId}`)

    // Clean up session state
    this.sessions.delete(sessionId)

    // TMUX cleanup is handled by TmuxSessionManager
    await this.tmuxManager.onSessionDeleted({ sessionID: sessionId })
  }

  /**
   * Handle session.created event
   */
  async handleSessionCreated(event: Event): Promise<void> {
    if (event.type !== "session.created") return

    const properties = (event as any).properties
    const sessionId = properties?.sessionID
    const parentId = properties?.parentID
    const title = properties?.title

    if (!sessionId) return

    console.log(`[EventHandler] Session created: ${sessionId}`)

    // Track session state
    this.sessions.set(sessionId, {
      sessionId,
      parentId,
      retryCount: 0,
      createdAt: new Date(),
    })

    // TMUX handling is done by TmuxSessionManager
    await this.tmuxManager.onSessionCreated({
      sessionID: sessionId,
      parentID: parentId,
      title: title || "New Session",
    })
  }

  /**
   * Main event handler
   */
  async handleEvent(event: Event): Promise<void> {
    switch (event.type) {
      case "session.created":
        await this.handleSessionCreated(event)
        break
      case "session.deleted":
        await this.handleSessionDeleted(event)
        break
      case "session.error":
        await this.handleSessionError(event)
        break
      case "message.updated":
        await this.handleMessageUpdated(event)
        break
    }
  }

  /**
   * Cleanup all sessions
   */
  async cleanup(): Promise<void> {
    this.sessions.clear()
  }
}
