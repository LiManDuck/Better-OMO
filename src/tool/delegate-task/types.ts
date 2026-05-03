/**
 * Delegate Task Tool Types
 */

/**
 * Arguments for delegate_task tool
 */
export interface DelegateTaskArgs {
  /** Task description */
  description: string
  /** Task prompt/instructions */
  prompt: string
  /** Category for model routing (optional) */
  category?: string
  /** Subagent type (optional) */
  subagent_type?: string
  /** Run in background mode */
  run_in_background: boolean
  /** Resume existing session (optional) */
  session_id?: string
  /** Skills to load */
  load_skills: string[]
  /** Fork context from parent agent (default: true) */
  fork?: boolean
}