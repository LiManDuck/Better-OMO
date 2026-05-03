/**
 * TMUX Types
 */

/**
 * TMUX layout options
 */
export type TmuxLayout =
  | "even-horizontal"
  | "even-vertical"
  | "main-horizontal"
  | "main-vertical"
  | "tiled"

/**
 * TMUX configuration
 */
export interface TmuxConfig {
  /** Enable TMUX integration */
  enabled: boolean
  /** Layout mode */
  layout: TmuxLayout
  /** Main pane size percentage (for main-* layouts) */
  main_pane_size: number
}

/**
 * Tracked session information
 */
export interface TrackedSession {
  /** Session ID */
  sessionId: string
  /** TMUX pane ID (e.g., "%42") */
  paneId: string
  /** Session description/title */
  description: string
  /** Creation timestamp */
  createdAt: Date
  /** Last seen timestamp */
  lastSeenAt: Date
}

/**
 * Result of spawning a TMUX pane
 */
export interface SpawnPaneResult {
  /** Whether the spawn was successful */
  success: boolean
  /** Pane ID if successful */
  paneId?: string
}
