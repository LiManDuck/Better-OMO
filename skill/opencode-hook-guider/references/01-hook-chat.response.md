# chat.response Hook 详解

## Hook 定义

```typescript
"chat.response"?: (
  input: {
    sessionID: string
    messageID: string
    userMessageID: string
    model: { id: string; providerID: string }
    agent: string
  },
  output: {
    finishReason: string
    tokens?: { input: number; output: number }
    cost?: number
    duration: number
    responseText: string
  }
) => Promise<void>
```

**触发时机**: LLM 响应完成时

**文件位置**: `packages/opencode/src/session/processor-cac.ts` (行 61)

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
  finishReason: string,        // 结束原因 (stop, length, content_filter, etc.)
  tokens?: {                   // Token 使用量
    input: number,            // 输入 token 数
    output: number            // 输出 token 数
  },
  cost?: number,               // 花费 (如果可用)
  duration: number,            // 请求耗时 (毫秒)
  responseText: string         // 响应文本内容
}
```

---

## 使用场景

### 1. 响应日志记录
```typescript
"chat.response": async (input, output) => {
  console.log(`LLM response: ${output.responseText.substring(0, 100)}...`)
  console.log(`Duration: ${output.duration}ms`)
}
```

### 2. Token 使用统计
```typescript
"chat.response": async (input, output) => {
  if (output.tokens) {
    const total = output.tokens.input + output.tokens.output
    console.log(`Tokens used: ${total}`)
  }
}
```

### 3. 成本计算
```typescript
"chat.response": async (input, output) => {
  if (output.cost !== undefined) {
    console.log(`Cost: $${output.cost.toFixed(4)}`)
  }
}
```

---

## 注意事项

- `duration` 是从请求发送到收到响应的时间
- `tokens` 和 `cost` 可能因 Provider 而异
- `responseText` 是完整的响应文本，可能很长
