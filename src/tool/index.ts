/**
 * Better-OMO Tool System
 */

import type { ToolDefinition } from "@opencode-ai/plugin"

// Will be implemented in individual tool files
export type { ToolDefinition }

/**
 * Create all built-in tools
 */
export function createBuiltinTools(): Record<string, ToolDefinition> {
  return {
    // Will be populated with actual tools
  }
}
