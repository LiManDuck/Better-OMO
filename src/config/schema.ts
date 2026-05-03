/**
 * Better-OMO Configuration Schema
 * Simplified from oh-my-opencode, removing multi-agent orchestration
 */

import { z } from "zod"

/**
 * Permission values
 */
const PermissionValue = z.enum(["ask", "allow", "deny"])

const BashPermission = z.union([
  PermissionValue,
  z.record(z.string(), PermissionValue),
])

const AgentPermissionSchema = z.object({
  edit: PermissionValue.optional(),
  bash: BashPermission.optional(),
  webfetch: PermissionValue.optional(),
  external_directory: PermissionValue.optional(),
})

/**
 * Agent configuration override
 */
export const AgentOverrideConfigSchema = z.object({
  /** Model to use for this agent */
  model: z.string().optional(),
  /** Temperature for model responses */
  temperature: z.number().min(0).max(2).optional(),
  /** Top-p sampling */
  top_p: z.number().min(0).max(1).optional(),
  /** Custom prompt */
  prompt: z.string().optional(),
  /** Append to default prompt */
  prompt_append: z.string().optional(),
  /** Tool permissions */
  tools: z.record(z.string(), z.boolean()).optional(),
  /** Disable this agent */
  disable: z.boolean().optional(),
  /** Agent description */
  description: z.string().optional(),
  /** Agent color (hex) */
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  /** Agent permissions */
  permission: AgentPermissionSchema.optional(),
  /** Skills to inject */
  skills: z.array(z.string()).optional(),
})

/**
 * Agent overrides configuration
 */
export const AgentOverridesSchema = z.object({
  explore: AgentOverrideConfigSchema.optional(),
  general: AgentOverrideConfigSchema.optional(),
  "look-at": AgentOverrideConfigSchema.optional(),
  "claude-code": AgentOverrideConfigSchema.optional(),
  clawcoder: AgentOverrideConfigSchema.optional(),
  autose: AgentOverrideConfigSchema.optional(),
})

/**
 * TMUX configuration
 */
export const TmuxLayoutSchema = z.enum([
  'main-horizontal',
  'main-vertical',
  'tiled',
  'even-horizontal',
  'even-vertical',
])

export const TmuxConfigSchema = z.object({
  enabled: z.boolean().default(false),
  layout: TmuxLayoutSchema.default('main-vertical'),
  main_pane_size: z.number().min(20).max(80).default(60),
})

/**
 * Background task configuration
 */
export const BackgroundTaskConfigSchema = z.object({
  defaultConcurrency: z.number().min(1).optional(),
  providerConcurrency: z.record(z.string(), z.number().min(0)).optional(),
  modelConcurrency: z.record(z.string(), z.number().min(0)).optional(),
  staleTimeoutMs: z.number().min(60000).optional(),
})

/**
 * Skill configuration
 */
export const SkillSourceSchema = z.union([
  z.string(),
  z.object({
    path: z.string(),
    recursive: z.boolean().optional(),
    glob: z.string().optional(),
  }),
])

export const SkillDefinitionSchema = z.object({
  description: z.string().optional(),
  template: z.string().optional(),
  from: z.string().optional(),
  model: z.string().optional(),
  agent: z.string().optional(),
  subtask: z.boolean().optional(),
  "argument-hint": z.string().optional(),
  license: z.string().optional(),
  compatibility: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  "allowed-tools": z.array(z.string()).optional(),
  disable: z.boolean().optional(),
})

export const SkillEntrySchema = z.union([
  z.boolean(),
  SkillDefinitionSchema,
])

export const SkillsConfigSchema = z.union([
  z.array(z.string()),
  z.record(z.string(), SkillEntrySchema).and(z.object({
    sources: z.array(SkillSourceSchema).optional(),
    enable: z.array(z.string()).optional(),
    disable: z.array(z.string()).optional(),
  }).partial()),
])

/**
 * Hook names for Better-OMO (simplified from OMO)
 */
export const HookNameSchema = z.enum([
  "anthropic-context-window-limit-recovery",
  "auto-slash-command",
  "session-recovery",
  "context-window-monitor",
  "rules-injector",
  "compaction-context-injector",
])

/**
 * Better-OMO configuration schema
 */
export const BtOmoConfigSchema = z.object({
  $schema: z.string().optional(),

  // Provider configuration
  provider: z.string().optional(),

  // Model configuration
  default_model: z.string().optional(),

  // Environment variables
  env: z.record(z.string(), z.string()).optional(),

  // Agent configuration
  agents: AgentOverridesSchema.optional(),

  // Disabled features
  disabled_hooks: z.array(HookNameSchema).optional(),

  // TMUX configuration
  tmux: TmuxConfigSchema.optional(),

  // Background task configuration
  background_task: BackgroundTaskConfigSchema.optional(),

  // Skills configuration
  skills: SkillsConfigSchema.optional(),
})

// Export types
export type BtOmoConfig = z.infer<typeof BtOmoConfigSchema>
export type AgentOverrideConfig = z.infer<typeof AgentOverrideConfigSchema>
export type AgentOverrides = z.infer<typeof AgentOverridesSchema>
export type TmuxConfig = z.infer<typeof TmuxConfigSchema>
export type TmuxLayout = z.infer<typeof TmuxLayoutSchema>
export type BackgroundTaskConfig = z.infer<typeof BackgroundTaskConfigSchema>
export type SkillsConfig = z.infer<typeof SkillsConfigSchema>
export type SkillDefinition = z.infer<typeof SkillDefinitionSchema>
export type HookName = z.infer<typeof HookNameSchema>
