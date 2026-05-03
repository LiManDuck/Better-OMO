/**
 * Delegate Task Categories
 *
 * Categories help route tasks to appropriate models
 */

/**
 * Default category configurations
 */
export const DEFAULT_CATEGORIES = {
  "visual-engineering": {
    model: "anthropic/claude-sonnet-4-6",
    description: "Visual UI/UX work and frontend engineering",
  },
  "quick": {
    model: "anthropic/claude-haiku-3-5",
    description: "Quick tasks and simple operations",
  },
  "writing": {
    model: "anthropic/claude-sonnet-4-6",
    description: "Documentation and content writing",
  },
} as const

/**
 * Category descriptions for prompt
 */
export const CATEGORY_DESCRIPTIONS = {
  "visual-engineering": "Frontend UI/UX work, visual changes, component design",
  "quick": "Simple, quick tasks that don't need heavy reasoning",
  "writing": "Documentation, README, comments, content creation",
} as const