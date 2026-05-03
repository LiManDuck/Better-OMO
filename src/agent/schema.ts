/**
 * Agent type definitions for Better-OMO
 */

import type { AgentConfig } from "@opencode-ai/sdk"

/**
 * Agent factory function type
 */
export type AgentFactory = (model: string) => AgentConfig

/**
 * Agent names in Better-OMO
 */
export type BtOmoAgentName =
  | "explore"
  | "general"
  | "look-at"
  | "claude-code"
  | "clawcoder"
  | "autose"

/**
 * Agent metadata for prompt generation
 */
export interface AgentMetadata {
  /** Agent display name */
  name: string
  /** Agent description */
  description: string
  /** Agent category */
  category: "exploration" | "general" | "specialist"
  /** Whether agent has read-only permissions */
  readOnly?: boolean
}
