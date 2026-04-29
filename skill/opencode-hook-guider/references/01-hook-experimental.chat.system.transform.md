# experimental.chat.system.transform Hook 详解

## Hook 定义

```typescript
"experimental.chat.system.transform"?: (
  input: { 
    sessionID?: string
    model: Model 
  },
  output: { 
    system: string[]
  }
) => Promise<void>
```

**触发时机**: 系统提示构造前，发送给 LLM 前

**文件位置**: `packages/opencode/src/session/llm.ts` (行 89)

---

## Input 详解

```typescript
input: {
  sessionID?: string,   // 会话ID (可选)
  model: Model          // 模型信息
}
```

---

## Output 详解

```typescript
output: {
  system: string[]  // 系统提示数组
}
```

**默认结构**: 通常包含两部分，第一部分是固定头部，第二部分是动态系统提示

---

## 使用场景

### 1. 添加系统提示
```typescript
"experimental.chat.system.transform": async (input, output) => {
  output.system.push("You are a code review assistant.")
}
```

### 2. 根据模型调整提示
```typescript
"experimental.chat.system.transform": async (input, output) => {
  if (input.model.id.includes("gpt-4")) {
    output.system.push("Use detailed explanations.")
  }
}
```

---

## 注意事项

- 这是实验性 Hook
- 系统提示会影响模型行为
- 添加过多可能导致上下文溢出
