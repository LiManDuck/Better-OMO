# chat.message Hook 详解

## Hook 定义

```typescript
"chat.message"?: (
  input: {
    sessionID: string
    agent?: string
    model?: { providerID: string; modelID: string }
    messageID?: string
    variant?: string
  },
  output: { 
    message: UserMessage
    parts: Part[]
  }
) => Promise<void>
```

**触发时机**: 收到新用户消息时，消息入队前

**文件位置**: `packages/opencode/src/plugin/index.ts` (通过 Plugin.trigger 调用)

---

## Input 详解

```typescript
input: {
  sessionID: string,                    // 会话ID
  agent?: string,                       // Agent 名称 (可选)
  model?: {                             // 模型信息 (可选)
    providerID: string,
    modelID: string
  },
  messageID?: string,                   // 消息ID (可选)
  variant?: string                      // 变体 (可选)
}
```

---

## Output 详解

```typescript
output: {
  message: UserMessage,     // 用户消息对象
  parts: Part[]             // 消息部分数组
}
```

**UserMessage 类型**:
```typescript
interface UserMessage {
  id: string
  sessionID: string
  role: "user"
  time: { created: number }
  agent?: string
  model?: Model
  variant?: string
}
```

**Part 类型** (可以是以下之一):
- `TextPart`: `{ type: "text", text: string }`
- `ToolPart`: `{ type: "tool", tool: string, callID: string, state: {...} }`
- `ImagePart`: `{ type: "image", mime: string, url: string }`
- `FilePart`: `{ type: "file", mime: string, url: string }`

---

## 使用场景

### 1. 消息修改
```typescript
"chat.message": async (input, output) => {
  // 可以修改 parts
  output.parts = output.parts.map(part => {
    if (part.type === "text") {
      return { ...part, text: part.text.toUpperCase() }
    }
    return part
  })
}
```

### 2. 添加系统提示
```typescript
"chat.message": async (input, output) => {
  output.parts.unshift({
    type: "text",
    text: "You are helping with a code review task."
  })
}
```

---

## 注意事项

- 此 Hook 在消息入队前触发，可以修改消息内容
- `message` 和 `parts` 都会被发送到 LLM
- 修改 `parts` 时注意保持类型安全
