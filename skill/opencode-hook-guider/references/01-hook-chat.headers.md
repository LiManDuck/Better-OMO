# chat.headers Hook 详解

## Hook 定义

```typescript
"chat.headers"?: (
  input: { 
    sessionID: string
    agent: string
    model: Model
    provider: ProviderContext
    message: UserMessage
  },
  output: { 
    headers: Record<string, string>
  }
) => Promise<void>
```

**触发时机**: 发送 LLM 请求前，设置请求头

**文件位置**: `packages/opencode/src/session/llm.ts` (行 138)

---

## Input 详解

```typescript
input: {
  sessionID: string,    // 会话ID
  agent: string,        // Agent 名称
  model: Model,         // 模型信息
  provider: ProviderContext,  // Provider 信息
  message: UserMessage  // 用户消息
}
```

---

## Output 详解

```typescript
output: {
  headers: Record<string, string>  // HTTP 请求头
}
```

**默认 headers**: `{}` (空对象)

---

## 使用场景

### 1. 添加自定义请求头
```typescript
"chat.headers": async (input, output) => {
  output.headers["X-Custom-Header"] = "custom-value"
}
```

### 2. 添加追踪信息
```typescript
"chat.headers": async (input, output) => {
  output.headers["X-Request-ID"] = crypto.randomUUID()
}
```

---

## 注意事项

- headers 会添加到所有 LLM 请求中
- 部分 Provider 可能不支持自定义 headers
- 谨慎使用，避免与 Provider 冲突
