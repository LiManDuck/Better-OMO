# NGA Hook 编程指南

> 本指南帮助你快速掌握 NGA (CodeAgent CLI) Hook 的开发

---

## 一、插件基础结构

### 1.1 最简插件

```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async ({ directory }) => {
  return {
    // Hook 实现
  }
}
```

### 1.2 完整参数

```typescript
import type { Plugin } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async ({ 
  client,      // OpenCode 客户端实例
  project,     // 项目信息
  directory,   // 插件目录
  worktree,    // 工作目录
  serverUrl,   // 服务器 URL
  $            // BunShell 实例
}) => {
  return {
    // Hook 实现
  }
}
```

---

## 二、Hook 编写示例

### 2.1 tool.execute.after - 工具执行后记录

```typescript
import type { Plugin } from "@opencode-ai/plugin"
import fs from "fs"
import path from "path"

export const ToolLogger: Plugin = async ({ directory }) => {
  const LOG_FILE = path.join(directory, "tool-logs.json")

  return {
    "tool.execute.after": async (input, output) => {
      const log = {
        timestamp: new Date().toISOString(),
        tool: input.tool,
        sessionID: input.sessionID,
        title: output.title,
        output: output.output?.substring(0, 500), // 截断避免日志过大
        metadata: output.metadata
      }
      fs.appendFileSync(LOG_FILE, JSON.stringify(log, null, 2) + "\n---\n")
    }
  }
}
```

### 2.2 tool.execute.before - 修改工具参数

```typescript
export const ToolModifier: Plugin = async ({}) => {
  return {
    "tool.execute.before": async (input, output) => {
      // 限制 bash 超时时间
      if (input.tool === "bash" && output.args.timeout > 300000) {
        output.args.timeout = 300000 // 最大 5 分钟
      }
      // 为 read 添加强制 offset
      if (input.tool === "read") {
        output.args.offset = output.args.offset ?? 1
      }
    }
  }
}
```

### 2.3 chat.params - 修改 LLM 参数

```typescript
export const ParamsModifier: Plugin = async ({}) => {
  return {
    "chat.params": async (input, output) => {
      // 根据 Agent 调整温度
      if (input.agent.name === "plan") {
        output.temperature = 0.9 // 计划模式更有创造性
      } else {
        output.temperature = 0.7 // 构建模式更稳定
      }
      // 添加自定义选项
      output.options.custom_option = "value"
    }
  }
}
```

### 2.4 chat.response - 记录 LLM 响应

```typescript
export const ResponseLogger: Plugin = async ({ client }) => {
  return {
    "chat.response": async (input, output) => {
      // 发送到日志服务
      client.app.log({
        body: {
          event: "llm_response",
          model: input.model.id,
          duration: output.duration,
          tokens: output.tokens,
          finishReason: output.finishReason
        }
      })
    }
  }
}
```

### 2.5 chat.error - 错误处理

```typescript
export const ErrorHandler: Plugin = async ({ client }) => {
  return {
    "chat.error": async (input, output) => {
      console.error("LLM Error:", output.error.message)
      // 发送到监控系统
      await fetch("https://your-monitor.com/api/errors", {
        method: "POST",
        body: JSON.stringify({
          sessionID: input.sessionID,
          error: output.error.message,
          duration: output.duration
        })
      })
    }
  }
}
```

### 2.6 permission.ask - 权限控制

```typescript
export const PermissionController: Plugin = async ({}) => {
  return {
    "permission.ask": async (input, output) => {
      // 自动允许读取项目目录
      if (input.permission === "read") {
        output.status = "allow"
        return
      }
      // 禁止危险命令
      if (input.permission === "bash") {
        const dangerous = ["rm -rf", "format", "del /s"]
        if (dangerous.some(d => input.patterns?.some(p => p.includes(d)))) {
          output.status = "deny"
          return
        }
      }
    }
  }
}
```

### 2.7 shell.env - 环境变量

```typescript
export const ShellEnvModifier: Plugin = async ({}) => {
  return {
    "shell.env": async (input, output) => {
      // 设置代理
      output.env.HTTP_PROXY = "http://proxy.example.com:8080"
      // 设置项目特定变量
      if (input.cwd.includes("production")) {
        output.env.NODE_ENV = "production"
      }
    }
  }
}
```

### 2.8 experimental.chat.messages.transform - 消息转换

```typescript
export const MessageTransformer: Plugin = async ({}) => {
  return {
    "experimental.chat.messages.transform": async (input, output) => {
      // 在所有消息前添加系统消息
      output.messages.unshift({
        info: { role: "system", id: "custom-system" } as any,
        parts: [{ type: "text", text: "你是一个代码审查助手。" }]
      })
    }
  }
}
```

### 2.9 experimental.chat.system.transform - 系统提示

```typescript
export const SystemPromptModifier: Plugin = async ({}) => {
  return {
    "experimental.chat.system.transform": async (input, output) => {
      // 添加额外系统指令
      output.system.push("\n\n请用中文回复。")
    }
  }
}
```

---

## 三、Event 监听示例

### 3.1 监听文件编辑事件

```typescript
export const FileEditWatcher: Plugin = async ({}) => {
  return {
    event: async ({ event }) => {
      if (event.type === "file.edited") {
        console.log("File edited:", event.properties.file)
      }
    }
  }
}
```

### 3.2 监听工具执行状态

```typescript
export const ToolStatusWatcher: Plugin = async ({}) => {
  return {
    event: async ({ event }) => {
      if (event.type === "message.part.updated") {
        const part = event.properties.part
        if (part.type === "tool") {
          console.log(`Tool: ${part.tool}, Status: ${part.state.status}`)
        }
      }
    }
  }
}
```

### 3.3 监听会话状态

```typescript
export const SessionWatcher: Plugin = async ({}) => {
  return {
    event: async ({ event }) => {
      const props = event.properties as any
      
      switch (event.type) {
        case "session.created":
          console.log("Session created:", props.info?.id)
          break
        case "session.deleted":
          console.log("Session deleted:", props.info?.id)
          break
        case "session.diff":
          console.log("Code changed:", props.diff?.map((d: any) => d.file).join(", "))
          break
        case "session.idle":
          console.log("Session idle:", props.sessionID)
          break
      }
    }
  }
}
```

### 3.4 完整的事件监听模板

```typescript
export const EventLogger: Plugin = async ({}) => {
  return {
    event: async ({ event }) => {
      // 过滤只处理特定事件
      const interestedEvents = [
        "session.created",
        "session.diff",
        "message.part.updated",
        "file.edited"
      ]
      
      if (!interestedEvents.includes(event.type)) return
      
      console.log(`[${event.type}]`, JSON.stringify(event.properties, null, 2))
    }
  }
}
```

---

## 四、sessionID 获取技巧

不同事件的 sessionID 位置不同：

```typescript
export const SessionIDHelper: Plugin = async ({}) => {
  return {
    event: async ({ event }) => {
      const props = event.properties as any
      let sessionID: string | null = null

      switch (event.type) {
        case "session.created":
        case "session.updated":
        case "session.deleted":
          sessionID = props.info?.id
          break
        case "session.diff":
        case "session.error":
        case "message.updated":
        case "message.queue.updated":
          sessionID = props.sessionID
          break
        case "message.part.updated":
        case "message.part.delta":
        case "message.part.removed":
          sessionID = props.part?.sessionID
          break
      }

      if (sessionID) {
        console.log("SessionID:", sessionID)
      }
    }
  }
}
```

---

## 五、调试技巧

### 5.1 开发时打印日志

```typescript
export const DebugPlugin: Plugin = async ({ client }) => {
  return {
    "tool.execute.before": async (input, output) => {
      // 使用 client.app.log 记录到 OpenCode 日志
      client.app.log({
        level: "info",
        body: { message: "tool called", tool: input.tool }
      })
    }
  }
}
```

### 5.2 写入调试文件

```typescript
import fs from "fs"
import path from "path"

export const DebugPlugin: Plugin = async ({ directory }) => {
  const DEBUG_FILE = path.join(directory, "debug.log")

  return {
    event: async ({ event }) => {
      fs.appendFileSync(DEBUG_FILE, 
        `[${new Date().toISOString()}] ${event.type}\n${
          JSON.stringify(event.properties, null, 2)}\n---\n`
      )
    }
  }
}
```

---

## 六、常见 Hook 组合

### 6.1 代码修改追踪

```typescript
export const CodeChangeTracker: Plugin = async ({}) => {
  return {
    event: async ({ event }) => {
      if (event.type === "file.edited") {
        console.log("File modified:", event.properties.file)
      }
    }
  }
}
```

### 6.2 工具执行时间统计

```typescript
export const ToolTimingTracker: Plugin = async ({ directory }) => {
  const TIMING_FILE = path.join(directory, "timing.json")

  return {
    "tool.execute.before": async (input, output) => {
      // 记录开始时间到全局变量或文件
      global[`tool_start_${input.callID}`] = Date.now()
    },
    "tool.execute.after": async (input, output) => {
      const startTime = global[`tool_start_${input.callID}`]
      if (startTime) {
        const duration = Date.now() - startTime
        fs.appendFileSync(TIMING_FILE, 
          JSON.stringify({ tool: input.tool, duration }) + "\n"
        )
        delete global[`tool_start_${input.callID}`]
      }
    }
  }
}
```

### 6.3 LLM 调用监控

```typescript
export const LLMMonitor: Plugin = async ({ directory }) => {
  const LOG_FILE = path.join(directory, "llm-monitor.json")

  return {
    "chat.response": async (input, output) => {
      fs.appendFileSync(LOG_FILE, JSON.stringify({
        model: input.model.id,
        duration: output.duration,
        tokens: output.tokens,
        cost: output.cost,
        timestamp: new Date().toISOString()
      }) + "\n")
    },
    "chat.error": async (input, output) => {
      fs.appendFileSync(LOG_FILE, JSON.stringify({
        error: output.error.message,
        duration: output.duration,
        timestamp: new Date().toISOString()
      }) + "\n")
    }
  }
}
```

---

## 七、文件组织建议

```
.opencode/plugins/
├── my-plugin.ts          # 主入口
├── types.ts              # 类型定义
├── utils.ts              # 工具函数
└── handlers/
    ├── tool-handler.ts
    └── event-handler.ts
```

> **注意**：子目录不会被自动扫描，请将主入口文件直接放在 `.opencode/plugins/` 目录下。

---

## 八、快速索引

| 需求 | 推荐 Hook/Event |
|------|-----------------|
| 记录工具执行结果 | `tool.execute.after` |
| 修改工具参数 | `tool.execute.before` |
| 调整 LLM 参数 | `chat.params` |
| 记录 LLM 响应 | `chat.response` |
| 错误处理 | `chat.error` |
| 权限控制 | `permission.ask` |
| 监听文件变更 | `event: file.edited` |
| 监听工具状态 | `event: message.part.updated` |
| 监听会话创建 | `event: session.created` |
