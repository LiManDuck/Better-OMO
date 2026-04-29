# experimental.chat.messages.transform Hook 详解

## Hook 定义

```typescript
"experimental.chat.messages.transform"?: (
  input: {},
  output: {
    messages: {
      info: Message
      parts: Part[]
    }[]
  }
) => Promise<void>
```

**触发时机**: 消息转换前，发送给 LLM 前

**文件位置**: `packages/opencode/src/session/prompt.ts` (行 667)

---

## Input 详解

```typescript
input: {}  // 空对象
```

---

## Output 详解

```typescript
output: {
  messages: {
    info: Message,    // 消息信息
    parts: Part[]     // 消息部分
  }[]
}
```

---

## 使用场景

### 1. 消息过滤
```typescript
"experimental.chat.messages.transform": async (input, output) => {
  // 过滤掉敏感消息
  output.messages = output.messages.filter(msg => {
    return !msg.parts.some(p => p.type === "text" && p.text.includes("password"))
  })
}
```

### 2. 消息修改
```typescript
"experimental.chat.messages.transform": async (input, output) => {
  // 修改所有消息
  output.messages = output.messages.map(msg => ({
    ...msg,
    parts: msg.parts.map(part => {
      if (part.type === "text") {
        return { ...part, text: part.text.toUpperCase() }
      }
      return part
    })
  }))
}
```

---

## 注意事项

- 这是实验性 Hook，可能在未来版本中变化
- 可以修改发送给 LLM 的所有消息
- 谨慎使用，避免破坏消息格式
