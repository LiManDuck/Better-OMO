/**
 * Delegate Task Tool Implementation
 */

import { tool, type ToolDefinition, type PluginInput } from "@opencode-ai/plugin"
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

  return tool({
    description: `Spawn agent task with category-based or direct agent selection.

MUTUALLY EXCLUSIVE: Provide EITHER category OR subagent_type, not both (unless continuing a session).

Categories route to appropriate models:
${Object.entries(CATEGORY_DESCRIPTIONS).map(([name, desc]) => `  - ${name}: ${desc}`).join("\n")}

**fork parameter**: Controls context inheritance from parent agent.
- fork=true (default): Subagent inherits full conversation context
- fork=false: Subagent starts with minimal context

Background tasks run independently and can be monitored later.`,
    args: {
      description: tool.schema.string().describe("Brief task description for logging and identification"),
      prompt: tool.schema.string().describe("Full task instructions for the subagent"),
      category: tool.schema.enum(categoryNames as [string, ...string[]]).optional().describe("Category for model routing (optional)"),
      subagent_type: tool.schema.string().optional().describe("Direct agent selection (optional)"),
      run_in_background: tool.schema.boolean().default(false).describe("Run task in background for monitoring"),
      session_id: tool.schema.string().optional().describe("Resume existing session (optional)"),
      load_skills: tool.schema.array(tool.schema.string()).default([]).describe("Skills to inject into agent context"),
      fork: tool.schema.boolean().default(true).describe("Inherit parent agent's conversation context"),
    },
    async execute(args) {
      const {
        prompt,
        category,
        subagent_type,
        run_in_background,
        session_id,
        load_skills,
        fork = true,
      } = args

      const description = args.description

      try {
        // Validate mutually exclusive parameters
        if (category && subagent_type && !session_id) {
          return {
            output: "ERROR: Cannot specify both category and subagent_type (unless resuming a session with session_id)",
            metadata: { error: true },
          }
        }

        // Determine agent and model
        let agentType = subagent_type

        if (category && !subagent_type) {
          const categoryConfig = DEFAULT_CATEGORIES[category as keyof typeof DEFAULT_CATEGORIES]
          if (categoryConfig) {
            // categoryConfig.model is available but not used currently
            agentType = "general" // Use general agent for categories
          }
        }

        // Default to general agent if nothing specified
        if (!agentType) {
          agentType = "general"
        }

        // Prepare message
        let message = prompt
        if (load_skills && Array.isArray(load_skills) && load_skills.length > 0) {
          message += `\n\n[Skills loaded: ${load_skills.join(", ")}]`
        }

                // Create session
        const result = await client.session.create({
          body: {
            parentID: session_id,
            title: description,
          },
          query: fork ? undefined : { directory: process.cwd() },
        })

        if (result.error) {
          return {
            output: `ERROR: ${result.error}`,
            metadata: { error: true },
          }
        }

        const newSessionId = result.data.id

        // Background vs foreground handling
        if (run_in_background) {
          return {
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
          return {
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
          output: `ERROR: ${errorMsg}`,
          metadata: { error: true },
        }
      }
    },
  })
}