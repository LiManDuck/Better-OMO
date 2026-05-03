/**
 * Better-OMO Plugin Configuration Loader
 */

import * as fs from "fs"
import * as path from "path"
import * as os from "os"
import { BtOmoConfigSchema, type BtOmoConfig } from "./config/schema"
import { CONFIG_PATHS } from "./constants"

/**
 * Load config from a specific path
 */
function loadConfigFromPath(configPath: string): BtOmoConfig | null {
  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, "utf-8")
      const rawConfig = JSON.parse(content)
      const result = BtOmoConfigSchema.safeParse(rawConfig)

      if (!result.success) {
        result.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(", ")
        console.error(`[Better-OMO] Config validation error in ${configPath}:`, result.error.issues)
        return null
      }

      console.log(`[Better-OMO] Config loaded from ${configPath}`)
      return result.data
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error(`[Better-OMO] Error loading config from ${configPath}:`, errorMsg)
  }
  return null
}

/**
 * Expand home directory in path
 */
function expandHome(filePath: string): string {
  if (filePath.startsWith("~/")) {
    return path.join(os.homedir(), filePath.slice(2))
  }
  return filePath
}

/**
 * Load and merge plugin configuration
 */
export function loadPluginConfig(directory: string): BtOmoConfig {
  // User-level config
  const userConfigPath = expandHome(CONFIG_PATHS.USER_CONFIG)

  // Project-level config
  const projectConfigPath = path.join(directory, "bt-omo.json")

  // Load user config first (base)
  let config: BtOmoConfig = loadConfigFromPath(userConfigPath) ?? {}

  // Override with project config
  const projectConfig = loadConfigFromPath(projectConfigPath)
  if (projectConfig) {
    config = {
      ...config,
      ...projectConfig,
      // Merge arrays
      disabled_hooks: [
        ...new Set([
          ...(config.disabled_hooks ?? []),
          ...(projectConfig.disabled_hooks ?? []),
        ]),
      ],
    }
  }

  console.log("[Better-OMO] Final config:", {
    provider: config.provider,
    default_model: config.default_model,
    disabled_hooks: config.disabled_hooks,
  })

  return config
}

export type { BtOmoConfig }
