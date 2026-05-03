/**
 * Delegate Task Tool Implementation
 */

import { tool, type ToolDefinition, type PluginInput } from "@opencode-ai/plugin"
import type { DelegateTaskArgs } from "./types"
import { DEFAULT_CATEGORIES, CATEGORY_DESCRIPTIONS } from "./constants"

type OpencodeClient = PluginInput["client"]

/**
 * Create delegate_task tool
 *
 * This tool allows spawning subagent tasks with category-based routing
 * and optional background execution.
 */
export function createDelegateTask(
  client: OpencodeClient
): ToolDefinition {
  const categoryNames = Object.keys(DEFAULT_CATEGORIES)
  const categoryList = categoryNames.map(name => {
    const desc = CATEGORY_DESCRIPTIONS[name as keyof typeof CATEGORY_DESCRIPTIONS]
    return desc ? `  - ${name}: ${desc}` : `  - ${name}`
  }).join("\n")

  return tool({
    name: "delegate_task",
    description: `Spawn agent task with category-based or direct agent selection.

MUTUALLY EXCLUSIVE: Provide EITHER category OR subagent_type, not both (unless continuing a session).

Categories route to appropriate models:
${categoryList}

**fork parameter**: Controls context inheritance from parent agent.
- fork=true (default): Subagent inherits full conversation context
- fork=false: Subagent starts with minimal context

Background tasks run independently and can be monitored later.`,
    parameters: {
      type: "object",
      properties: {
        description: {
          type: "string",
          description: "Brief task description for logging and identification",
        },
        prompt: {
          type: "string",
          description: "Full task instructions for the subagent",
        },
        category: {
          type: "string",
          enum: categoryNames,
          description: "Category for model routing (optional)",
        },
        subagent_type: {
          type: "string",
          description: "Direct agent selection (optional)",
        },
        run_in_background: {
          type: "boolean",
          default: false,
          description: "Run task in background for monitoring",
        },
        session_id: {
          type: "string",
          description: "Resume existing session (optional)",
        },
        load_skills: {
          type: "array",
          items: { type: "string" },
          default: [],
          description: "Skills to inject into agent context",
        },
        fork: {
          type: "boolean",
          default: true,
          description: "Inherit parent agent's conversation context",
        },
      },
      required: ["description", "prompt", "load_skills"],
    },
    execute: async (args: DelegateTaskArgs, context) => {
      const {
        description,
        prompt,
        category,
        subagent_type,
        run_in_background,
        session_id,
        load_skills,
        fork = true,
      } = args

      try {
        // Validate mutually exclusive parameters
        if (category && subagent_type && !session_id) {
          return {
            title: "Invalid parameters",
            output: "ERROR: Cannot specify both category and subagent_type (unless resuming a session with session_id)",
            metadata: { error: true },
          }
        }

        // Determine agent and model
        let agentType = subagent_type
        let modelOverride: string | undefined

        if (category && !subagent_type) {
          const categoryConfig = DEFAULT_CATEGORIES[category as keyof typeof DEFAULT_CATEGORIES]
          if (categoryConfig) {
            modelOverride = categoryConfig.model
            agentType = "general" // Use general agent for categories
          }
        }

        // Default to general agent if nothing specified
        if (!agentType) {
          agentType = "general"
        }

        // Create session
        const sessionCreatePayload: any = {
          agent: agentType,
          message: prompt,
          variant: "default",
        }

        if (modelOverride) {
          sessionCreatePayload.model = modelOverride
        }

        // Context handling based on fork parameter
        if (!fork) {
          // Minimal context - just the task
          sessionCreatePayload.context_mode = "minimal"
        } else {
          // Inherit parent context (default behavior)
          sessionCreatePayload.context_mode = "inherit"
        }

        // Handle skills loading (simplified - just mention in prompt)
        if (load_skills.length > 0) {
          const skillsNote = `\n\n[Skills loaded: ${load_skills.join(", ")}]`
          sessionCreatePayload.message = prompt + skillsNote
        }

        // Create session
        const result = await client.session.create(sessionCreatePayload)

        if (!result.ok) {
          return {
            title: "Failed to create task",
            output: `ERROR: ${result.error}`,
            metadata: { error: true },
          }
        }

        const newSessionId = result.data.sessionID

        // Background vs foreground handling
        if (run_in_background) {
          return {
            title: `Background task started: ${description}`,
            output: `Session ID: ${newSessionId}\nAgent: ${agentType}\nCategory: ${category || "none"}\nFork: ${fork}\nStatus: Running in background`,
            metadata: {
              session_id: newSessionId,
              background: true,
              agent: agentType,
              category,
              fork,
            },
          }
        } else {
          // For foreground tasks, we need to wait for completion
          // This is simplified - real implementation would poll for completion
          return {
            title: `Task created: ${description}`,
            output: `Session ID: ${newSessionId}\nAgent: ${agentType}\nCategory: ${category || "none"}\nFork: ${fork}\nInstructions: Use session_read tool to check results`,
            metadata: {
              session_id: newSessionId,
              background: false,
              agent: agentType,
              category,
              fork,
            },
          }
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        return {
          title: "Task creation failed",
          output: `ERROR: ${errorMsg}`,
          metadata: { error: true },
        }
      }
    },
  })
}