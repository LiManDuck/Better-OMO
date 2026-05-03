/**
 * Config module exports
 */

export {
  BtOmoConfigSchema,
  AgentOverrideConfigSchema,
  AgentOverridesSchema,
  TmuxConfigSchema,
  TmuxLayoutSchema,
  BackgroundTaskConfigSchema,
  SkillsConfigSchema,
  SkillDefinitionSchema,
  HookNameSchema,
  validateConfig,
} from "./schema"

export type {
  BtOmoConfig,
  AgentOverrideConfig,
  AgentOverrides,
  TmuxConfig,
  TmuxLayout,
  BackgroundTaskConfig,
  SkillsConfig,
  SkillDefinition,
  HookName,
} from "./schema"

export { loadBtOmoConfig } from "./loader"
