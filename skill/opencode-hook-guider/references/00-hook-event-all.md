# Hook 与 Event 汇总

> 本目录包含 CodeAgent CLI 所有 Hook 和 Event 的详细说明

---

## 一、Hook 汇总

### 1.1 Hook 定义
Hook 是插件系统中在特定时机触发的回调函数，可拦截 CodeAgent CLI 生命周期中的关键节点，**可修改 input/output**。

### 1.2 所有 Hook 一览

| Hook 名称 | 触发时机 | Input | Output | 详细说明 |
|-----------|----------|-------|--------|----------|
| `config` | 配置加载时 | `Config` | - | 见 01_Hook_config.md |
| `chat.message` | 收到新用户消息时 | `{sessionID, agent?, model?, messageID?, variant?}` | `{message: UserMessage, parts: Part[]}` | 见 01_Hook_chat.message.md |
| `chat.params` | 发送 LLM 请求前 | `{sessionID, agent, model, provider, message}` | `{temperature, topP, topK, options}` | 见 01_Hook_chat.params.md |
| `chat.headers` | 发送 LLM 请求前 | `{sessionID, agent, model, provider, message}` | `{headers: Record<string, string>}` | 见 01_Hook_chat.headers.md |
| `chat.response` | LLM 响应完成时 | `{sessionID, messageID, userMessageID, model, agent}` | `{finishReason, tokens?, cost?, duration, responseText}` | 见 01_Hook_chat.response.md |
| `chat.error` | LLM 请求错误时 | `{sessionID, messageID, userMessageID, model, agent}` | `{error: Error, duration}` | 见 01_Hook_chat.error.md |
| `permission.ask` | 权限请求时 | `Permission` | `{status: "ask" \| "deny" \| "allow"}` | 见 01_Hook_permission.ask.md |
| `command.execute.before` | 执行命令前 | `{command, sessionID, arguments}` | `{parts: Part[]}` | 见 01_Hook_command.execute.before.md |
| `tool.execute.before` | 执行工具前 | `{tool, sessionID, callID}` | `{args: any}` | 见 01_Hook_tool.execute.before.md |
| `shell.env` | Shell 环境准备时 | `{cwd, sessionID?, callID?}` | `{env: Record<string, string>}` | 见 01_Hook_shell.env.md |
| `tool.execute.after` | 执行工具后 | `{tool, sessionID, callID, args}` | `{title, output, metadata}` | 见 01_Hook_tool.execute.after.md |
| `experimental.chat.messages.transform` | 消息转换前 | `{}` | `{messages: {info: Message, parts: Part[]}[]}` | 见 01_Hook_expperimental.chat.messages.transform.md |
| `experimental.chat.system.transform` | 系统提示构造前 | `{sessionID?, model}` | `{system: string[]}` | 见 01_Hook_expperimental.chat.system.transform.md |
| `experimental.session.compacting` | 会话压缩前 | `{sessionID}` | `{context: string[], prompt?: string}` | 见 01_Hook_expperimental.session.compacting.md |
| `experimental.text.complete` | 文本补全时 | `{sessionID, messageID, partID}` | `{text: string}` | 见 01_Hook_expperimental.text.complete.md |
| `tool.definition` | 工具定义发送给 LLM 前 | `{toolID}` | `{description, parameters}` | 见 01_Hook_tool.definition.md |
| `event` | 任何 Bus 事件发布时 | `{event: Event}` | - | 见 01_Hook_event.md |

---

## 二、Event 汇总

### 2.1 Event 定义
Event 是通过事件总线（Bus）发布的消息，插件可通过 `event` Hook 订阅这些事件。Event 是**只读**的。

### 2.2 Session 相关事件 (10个)

| 事件名 | 触发时机 | properties | 详细说明 |
|--------|----------|------------|----------|
| `session.created` | 新建会话时 | `{info: Session.Info}` | 见 02_Event_session.md |
| `session.updated` | 会话信息变更时 | `{info: Session.Info}` | 见 02_Event_session.md |
| `session.deleted` | 删除会话时 | `{sessionID: string}` | 见 02_Event_session.md |
| `session.diff` | 代码差异变化时 | `{sessionID, diff}` | 见 02_Event_session.md |
| `session.error` | 会话发生错误时 | `{sessionID, error}` | 见 02_Event_session.md |
| `session.idle` | 会话空闲时 | `{sessionID}` | 见 02_Event_session.md |
| `session.status` | 会话状态变化时 | `{sessionID, status}` | 见 02_Event_session.md |
| `session.compacted` | 会话压缩完成时 | `{sessionID}` | 见 02_Event_session.md |
| `session.compacted_before` | 会话压缩前 | `{sessionID}` | 见 02_Event_session.md |
| `session.compacted_after` | 会话压缩后 | `{sessionID}` | 见 02_Event_session.md |

### 2.3 Message 相关事件 (6个)

| 事件名 | 触发时机 | properties | 详细说明 |
|--------|----------|------------|----------|
| `message.updated` | 消息更新时 | `{info: Message.Info}` | 见 03_Event_message.md |
| `message.removed` | 消息删除时 | `{sessionID, messageID}` | 见 03_Event_message.md |
| `message.queue.updated` | 排队状态更新时 | `{sessionID, runningTaskSize, waitingQueueIndex}` | 见 03_Event_message.md |
| `message.part.updated` | 消息部分更新时 | `{sessionID, messageID, partID, state}` | 见 03_Event_message.md |
| `message.part.delta` | 消息部分增量更新时 | `{sessionID, messageID, partID, field, delta}` | 见 03_Event_message.md |
| `message.part.removed` | 消息部分删除时 | `{sessionID, messageID, partID}` | 见 03_Event_message.md |

### 2.4 File 相关事件 (2个)

| 事件名 | 触发时机 | properties | 详细说明 |
|--------|----------|------------|----------|
| `file.edited` | 文件编辑完成时 | `{file: string}` | 见 04_Event_file.md |
| `file.watcher.updated` | 文件变化时 | `{file, event: "add" \| "change" \| "unlink"}` | 见 04_Event_file.md |

### 2.5 Permission 相关事件 (2个)

| 事件名 | 触发时机 | properties | 详细说明 |
|--------|----------|------------|----------|
| `permission.asked` | 用户执行敏感操作时 | `{sessionID, permission, patterns, always, metadata}` | 见 05_Event_permission.md |
| `permission.replied` | 用户响应权限请求时 | `{sessionID, permission, allowed}` | 见 05_Event_permission.md |

### 2.6 PTY 相关事件 (4个)

| 事件名 | 触发时机 | properties | 详细说明 |
|--------|----------|------------|----------|
| `pty.created` | 启动终端会话时 | `{info: PTY.SessionInfo}` | 见 06_Event_pty.md |
| `pty.updated` | 终端状态更新时 | `{info: PTY.SessionInfo}` | 见 06_Event_pty.md |
| `pty.exited` | 终端退出时 | `{id, exitCode}` | 见 06_Event_pty.md |
| `pty.deleted` | 终端删除时 | `{id}` | 见 06_Event_pty.md |

### 2.7 Command 相关事件 (4个)

| 事件名 | 触发时机 | properties | 详细说明 |
|--------|----------|------------|----------|
| `command.executed` | 执行斜杠命令时 | `{name, sessionID, arguments, messageID}` | 见 07_Event_command.md |
| `command.reload` | 命令重载时 | `{}` | 见 07_Event_command.md |
| `command.added` | 命令添加时 | `{command, description, handler}` | 见 07_Event_command.md |
| `command.removed` | 命令移除时 | `{command}` | 见 07_Event_command.md |

### 2.8 Todo 相关事件 (1个)

| 事件名 | 触发时机 | properties | 详细说明 |
|--------|----------|------------|----------|
| `todo.updated` | Todo列表更新时 | `{sessionID, todos}` | 见 08_Event_todo.md |

### 2.9 Question 相关事件 (3个)

| 事件名 | 触发时机 | properties | 详细说明 |
|--------|----------|------------|----------|
| `question.asked` | 提问用户时 | `{sessionID, question, header, options, multiple}` | 见 09_Event_question.md |
| `question.replied` | 用户回复问题时 | `{sessionID, question, answer}` | 见 09_Event_question.md |
| `question.rejected` | 用户拒绝回答时 | `{sessionID, question}` | 见 09_Event_question.md |

### 2.10 其他事件

| 事件类型 | 事件名 | 触发时机 | properties |
|----------|--------|----------|-------------|
| **Project** | `project.updated` | 项目配置更新时 | `{event, types}` |
| **LSP** | `lsp.updated` | Language Server 状态变化 | `{}` |
| **LSP** | `lsp.diagnostics` | 诊断信息更新 | `{path, serverID, diagnostics}` |
| **Plugin** | `plugin.reloaded` | 插件重载 | `{file}` |
| **Installation** | `installation.updated` | 安装版本更新 | `{version}` |
| **Installation** | `installation.update-available` | 发现新版本 | `{version}` |
| **IDE** | `ide.installed` | IDE插件安装 | `{name, version}` |
| **Server** | `server.connected` | 服务器连接成功 | `{}` |
| **Server** | `global.disposed` | 应用关闭 | `{}` |
| **Server** | `server.auth.login.dialog.closed` | 登录对话框关闭 | `{}` |
| **VCS** | `vcs.branch.updated` | Git分支切换 | `{branch}` |
| **Extension** | `extension.installed` | 扩展安装 | `{name, scope, path}` |
| **Extension** | `extension.removed` | 扩展移除 | `{name, scope, path}` |
| **Extension** | `extension.enabled` | 扩展启用 | `{name, scope}` |
| **Extension** | `extension.disabled` | 扩展禁用 | `{name, scope}` |
| **Extension** | `extension.cac.updated` | 扩展配置更新 | `{event, types}` |
| **TUI** | `tui.prompt.append` | 提示符追加 | `{text}` |
| **TUI** | `tui.command.execute` | TUI命令执行 | `{command, args}` |
| **TUI** | `tui.toast.show` | 显示提示框 | `{message, type}` |
| **TUI** | `tui.session.select` | 会话切换 | `{sessionID}` |
| **TUI** | `tui.force.login` | 强制登录 | `{}` |
| **TUI** | `tui.empty.models` | 模型列表为空 | `{}` |
| **MCP** | `mcp.tools.changed` | MCP工具变化 | `{server}` |
| **MCP** | `mcp.browser.open.failed` | 浏览器打开失败 | `{mcpName, url}` |
| **Provider** | `provider.login.success` | 登录成功 | `{provider}` |
| **Agent** | `agent.reload` | Agent重载 | `{}` |
| **Worktree** | `worktree.ready` | Worktree创建成功 | `{path}` |
| **Worktree** | `worktree.failed` | Worktree创建失败 | `{path, error}` |

> 注：其他事件相对简单，不再单独创建文件，详细属性请参考源码。

---

## 三、快速索引

### 3.1 Hook 文件索引
- 01_Hook_config.md
- 01_Hook_chat.message.md
- 01_Hook_chat.params.md
- 01_Hook_chat.headers.md
- 01_Hook_chat.response.md
- 01_Hook_chat.error.md
- 01_Hook_permission.ask.md
- 01_Hook_command.execute.before.md
- 01_Hook_tool.execute.before.md
- 01_Hook_shell.env.md
- 01_Hook_tool.execute.after.md
- 01_Hook_expperimental.chat.messages.transform.md
- 01_Hook_expperimental.chat.system.transform.md
- 01_Hook_expperimental.session.compacting.md
- 01_Hook_expperimental.text.complete.md
- 01_Hook_tool.definition.md
- 01_Hook_event.md

### 3.2 Event 文件索引
- 02_Event_session.md
- 03_Event_message.md
- 04_Event_file.md
- 05_Event_permission.md
- 06_Event_pty.md
- 07_Event_command.md
- 08_Event_todo.md
- 09_Event_question.md

### 3.3 编程指南
- 10_NGA_Hook_编程指南.md - Hook 编写实战教程

---

## 四、调试脚本

### 4.1 Hook 调试脚本

修改 Hook 名称即可调试不同 Hook 的输入输出：

```typescript
import type { Plugin } from "@opencode-ai/plugin"
import path from 'path'
import fs from 'fs'

export const HookDebug: Plugin = async ({ directory }) => {
  const LOG_FILE = path.join(directory, "hook-debug.log")

  return {
    // 在这里修改要调试的 Hook 名称
    "tool.execute.after": async (input, output) => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        hookName: "tool.execute.after",
        input: input,
        output: output
      }
      const logLine = JSON.stringify(logEntry, null, 2) + "\n---\n"
      fs.appendFileSync(LOG_FILE, logLine)
    },
  }
}
```

**常用 Hook 调试目标**:
- `tool.execute.before` - 查看工具执行前的参数
- `tool.execute.after` - 查看工具执行后的结果
- `chat.params` - 查看 LLM 请求参数
- `chat.response` - 查看 LLM 响应结果
- `chat.error` - 查看 LLM 错误信息
- `permission.ask` - 查看权限请求信息

---

### 4.2 Event 调试脚本

修改 `WATCHED_EVENT` 即可调试不同事件：

```typescript
import type { Plugin } from "@opencode-ai/plugin"
import path from 'path'
import fs from 'fs'

const WATCHED_EVENT = "file.edited"  // 在这里修改事件名

export const EventDebug: Plugin = async ({ directory }) => {
  const LOG_FILE = path.join(directory, "event-debug.log")

  return {
    event: async ({ event }) => {
      if (event.type !== WATCHED_EVENT) return

      const logEntry = {
        timestamp: new Date().toISOString(),
        eventType: event.type,
        properties: event.properties
      }
      const logLine = JSON.stringify(logEntry, null, 2) + "\n---\n"
      fs.appendFileSync(LOG_FILE, logLine)
    },
  }
}
```

**常用 Event 调试目标**:
- `session.created` - 查看新会话创建
- `message.part.updated` - 查看工具执行状态变化
- `file.edited` - 查看文件编辑完成
- `message.part.delta` - 查看文本流式输出
- `permission.asked` - 查看权限请求
- `question.asked` - 查看用户提问
