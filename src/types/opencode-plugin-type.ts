/**
 * Centralized type imports from @opencode-ai/plugin
 * This prevents scattered type definitions and makes it easier to update when plugin version changes
 */

export type {
  Event,
  Project,
  Model,
  Provider,
  Permission,
  UserMessage,
  Message,
  Part,
  Auth,
  Config as SDKConfig,
} from "@opencode-ai/sdk"

export type { Provider as ProviderV2, Model as ModelV2 } from "@opencode-ai/sdk/v2"

export type {
  PluginInput,
  PluginOptions,
  Config,
  Plugin,
  PluginModule,
  Hooks,
  ProviderContext,
  WorkspaceInfo,
  WorkspaceTarget,
  WorkspaceAdapter,
  AuthHook,
  AuthOAuthResult,
  ProviderHook,
  ProviderHookContext,
} from "@opencode-ai/plugin"

export type { ToolDefinition } from "@opencode-ai/plugin/tool"

// Re-export createOpencodeClient for convenience
export { createOpencodeClient } from "@opencode-ai/sdk"
