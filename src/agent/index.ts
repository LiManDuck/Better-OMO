/**
 * Better-OMO Agent System
 */

export type { AgentFactory, AgentMetadata, BtOmoAgentName } from "./schema"

export { createExploreAgent } from "./explore"
export { createGeneralAgent } from "./general"
export { createLookAtAgent } from "./look-at"
export { createClaudeCodeAgent } from "./claude-code"
export { createClawcoderAgent } from "./clawcoder"
export { createAutoseAgent } from "./autose"

import type { AgentConfig } from "@opencode-ai/sdk"
import type { BtOmoAgentName } from "./schema"
import { createExploreAgent } from "./explore"
import { createGeneralAgent } from "./general"
import { createLookAtAgent } from "./look-at"
import { createClaudeCodeAgent } from "./claude-code"
import { createClawcoderAgent } from "./clawcoder"
import { createAutoseAgent } from "./autose"

/**
 * All built-in agents
 */
export const builtinAgents: Record<BtOmoAgentName, (model: string) => AgentConfig> = {
  explore: createExploreAgent,
  general: createGeneralAgent,
  "look-at": createLookAtAgent,
  "claude-code": createClaudeCodeAgent,
  clawcoder: createClawcoderAgent,
  autose: createAutoseAgent,
}

/**
 * Create all built-in agents
 */
export function createBuiltinAgents(model: string): Record<string, AgentConfig> {
  const agents: Record<string, AgentConfig> = {}

  for (const [name, factory] of Object.entries(builtinAgents)) {
    agents[name] = factory(model)
  }

  return agents
}

/**
 * Discover all available agents (built-in + user-defined)
 */
export async function discoverAgents(): Promise<AgentConfig[]> {
  const defaultModel = process.env.OPENCODE_MODEL || "claude-3-5-sonnet-20241022"
  const agents = createBuiltinAgents(defaultModel)
  return Object.entries(agents).map(([name, config]) => ({
    name,
    ...config,
  }))
}
