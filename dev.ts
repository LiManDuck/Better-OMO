/**
 * Better-OMO Plugin Development Utilities
 */

import { spawn } from "bun"
import { readdirSync, statSync, unlinkSync, rmdirSync } from "fs"
import { join } from "path"

/**
 * Clean dist directory
 */
export async function clean() {
  const distPath = join(process.cwd(), "dist")

  try {
    const stats = statSync(distPath)
    if (stats.isDirectory()) {
      removeDirRecursive(distPath)
      console.log("✓ Cleaned dist directory")
    }
  } catch {
    // Directory doesn't exist, that's fine
    console.log("✓ Dist directory already clean")
  }
}

/**
 * Remove directory recursively
 */
function removeDirRecursive(dir: string) {
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = join(dir, file)
    const stats = statSync(filePath)

    if (stats.isDirectory()) {
      removeDirRecursive(filePath)
    } else {
      unlinkSync(filePath)
    }
  }

  rmdirSync(dir)
}

/**
 * Build the project
 */
export async function build() {
  console.log("Building Better-OMO plugin...")

  const proc = spawn({
    cmd: ["bun", "run", "typecheck"],
    stdout: "inherit",
    stderr: "inherit",
  })

  const exitCode = await proc.exited

  if (exitCode === 0) {
    console.log("✓ Build successful")
  } else {
    console.error("✗ Build failed")
    process.exit(1)
  }
}

/**
 * Watch for changes and rebuild
 */
export async function watch() {
  console.log("Watching for changes...")

  const proc = spawn({
    cmd: ["bun", "run", "build", "--", "--watch"],
    stdout: "inherit",
    stderr: "inherit",
  })

  await proc.exited
}

// Run based on argument
const command = process.argv[2]

switch (command) {
  case "clean":
    clean()
    break
  case "build":
    build()
    break
  case "watch":
    watch()
    break
  default:
    console.log("Usage: bun dev.ts [clean|build|watch]")
}
