# chat.error Hook 详解

## Hook 定义

```typescript
"chat.error"?: (
  input: { 
    sessionID: string
    messageID: string
    userMessageID: string
    model: { id: string; providerID: string }
    agent: string
  },
  output: { 
    error: Error
    duration: number
  }
) => Promise<void>
```

**触发时机**: LLM 请求错误时

**文件位置**: `packages/opencode/src/session/processor-cac.ts` (行 186)

---

## Input 详解

```typescript
input: {
  sessionID: string,           // 会话ID
  messageID: string,           // 助手消息ID
  userMessageID: string,       // 用户消息ID
  model: { 
    id: string,               // 模型ID
    providerID: string        // Provider ID
  },
  agent: string                // Agent 名称
}
```

---

## Output 详解

```typescript
output: {
  error: Error,                // 错误对象
  duration: number             // 请求耗时 (毫秒)
}
```

**常见错误类型**:
- 网络错误 (timeout, connection refused)
- API 错误 (rate limit, invalid API key)
- 模型错误 (unsupported model)
- 其他运行时错误

---

## 使用场景

### 1. 错误日志记录
```typescript
"chat.error": async (input, output) => {
  console.error(`LLM error: ${output.error.message}`)
  console.error(`Duration: ${output.duration}ms`)
}
```

### 2. 错误监控告警
```typescript
"chat.error": async (input, output) => {
  if (output.error.message.includes("rate limit")) {
    // 发送告警通知
  }
}
```

### 3. 自动重试逻辑
```typescript
"chat.error": async (input, output) => {
  // 可以记录错误用于后续分析
  const errorLog = {
    sessionID: input.sessionID,
    error: output.error.message,
    duration: output.duration,
    timestamp: Date.now()
  }
}
```

---

## 注意事项

- `duration` 是从请求发送到错误发生的时间
- `error` 是完整的 Error 对象，包含 `message`, `stack` 等
- 此 Hook 在 `chat.response` 之前触发（如果发生错误）
