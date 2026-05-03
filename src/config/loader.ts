/**
 * Better-OMO Configuration Loader
 * Loads configuration from ~/.config/opencode/bt-omo.json
 */

import { readFileSync, existsSync } from "fs"
import { homedir } from "os"
import { join } from "path"
import type { BtOmoConfig } from "./schema"
import { BtOmoConfigSchema } from "./schema"

/**
 * Default configuration
 */
const DEFAULT_CONFIG: BtOmoConfig = {}

/**
 * Load configuration from file
 */
export function loadBtOmoConfig(projectDirectory?: string): BtOmoConfig {
  const configPaths = [
    // Project-level config
    projectDirectory ? join(projectDirectory, "bt-omo.json") : null,
    // User-level config
    join(homedir(), ".config", "opencode", "bt-omo.json"),
  ].filter(Boolean) as string[]

  for (const configPath of configPaths) {
    if (existsSync(configPath)) {
      try {
        const content = readFileSync(configPath, "utf-8")
        const config = JSON.parse(content)
        const parsed = BtOmoConfigSchema.parse(config)
        console.log(`[Better-OMO] Loaded config from ${configPath}`)
        return parsed
      } catch (error) {
        console.error(`[Better-OMO] Failed to load config from ${configPath}:`, error)
      }
    }
  }

  console.log("[Better-OMO] No config file found, using defaults")
  return DEFAULT_CONFIG
}

/**
 * Validate configuration
 */
export function validateConfig(config: unknown): BtOmoConfig {
  const result = BtOmoConfigSchema.safeParse(config)
  if (!result.success) {
    throw new Error(`Invalid config: ${result.error.message}`)
  }
  return result.data
}

export { BtOmoConfigSchema } from "./schema"
export type { BtOmoConfig, AgentOverrideConfig, AgentOverrides } from "./schema"
