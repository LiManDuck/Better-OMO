---
name: nga-hook-guider
description: CodeAgent（Nga） CLI Hook 和 Event 详细参考文档。当需要了解 Hook 的触发时机、Input/Output 参数，或 Event 的属性和用途时使用此 skill。包括 config、chat、permission、command、tool、shell 等各类 Hook，以及 session、message、file、permission、pty、command、todo、question 等各类 Event。
---

# Hook Event Details

## Overview

此 skill 提供 CodeAgent CLI 所有 Hook 和 Event 的详细说明文档，供插件开发时参考。

## Quick Reference

### Hook 列表

| Hook 名称 | 触发时机 | 详细说明 |
|-----------|----------|----------|
| `config` | 配置加载时 | 见 references/01_Hook_config.md |
| `chat.message` | 收到新用户消息时 | 见 references/01_Hook_chat.message.md |
| `chat.params` | 发送 LLM 请求前 | 见 references/01_Hook_chat.params.md |
| `chat.headers` | 发送 LLM 请求前 | 见 references/01_Hook_chat.headers.md |
| `chat.response` | LLM 响应完成时 | 见 references/01_Hook_chat.response.md |
| `chat.error` | LLM 请求错误时 | 见 references/01_Hook_chat.error.md |
| `permission.ask` | 权限请求时 | 见 references/01_Hook_permission.ask.md |
| `command.execute.before` | 执行命令前 | 见 references/01_Hook_command.execute.before.md |
| `tool.execute.before` | 执行工具前 | 见 references/01_Hook_tool.execute.before.md |
| `shell.env` | Shell 环境准备时 | 见 references/01_Hook_shell.env.md |
| `tool.execute.after` | 执行工具后 | 见 references/01_Hook_tool.execute.after.md |
| `tool.definition` | 工具定义发送给 LLM 前 | 见 references/01_Hook_tool.definition.md |
| `event` | 任何 Bus 事件发布时 | 见 references/01_Hook_event.md |
| `experimental.*` | 实验性 Hook | 见 references/01_Hook_experimental.*.md |

### Event 列表

| 事件名 | 触发时机 | 详细说明 |
|--------|----------|----------|
| `session.*` | 会话相关事件 | 见 references/02_Event_session.md |
| `message.*` | 消息相关事件 | 见 references/03_Event_message.md |
| `file.*` | 文件相关事件 | 见 references/04_Event_file.md |
| `permission.*` | 权限相关事件 | 见 references/05_Event_permission.md |
| `pty.*` | 终端相关事件 | 见 references/06_Event_pty.md |
| `command.*` | 命令相关事件 | 见 references/07_Event_command.md |
| `todo.*` | 待办相关事件 | 见 references/08_Event_todo.md |
| `question.*` | 问题相关事件 | 见 references/09_Event_question.md |

## Usage

需要查询特定 Hook 或 Event 的详细信息时，阅读对应的参考文件：

- **Hook 定义和 Input/Output**: references/01_*.md
- **Event 属性**: references/02_*.md 到 09_*.md
- **Hook 编程指南**: references/10_NGA_Hook_编程指南.md
- **完整汇总**: references/00_Hook_Event_汇总.md

## Resources

详细文档位于 `references/` 目录：

- `00_Hook_Event_汇总.md` - 完整 Hook 和 Event 汇总表
- `01_Hook_*.md` - 各类 Hook 详细说明
- `02_Event_session.md` - 会话事件
- `03_Event_message.md` - 消息事件
- `04_Event_file.md` - 文件事件
- `05_Event_permission.md` - 权限事件
- `06_Event_pty.md` - 终端事件
- `07_Event_command.md` - 命令事件
- `08_Event_todo.md` - 待办事件
- `09_Event_question.md` - 问题事件
- `10_NGA_Hook_编程指南.md` - Hook 编程指南
