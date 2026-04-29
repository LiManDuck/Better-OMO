# experimental.session.compacting Hook 详解

## Hook 定义

```typescript
"experimental.session.compacting"?: (
  input: { sessionID: string },
  output: { 
    context: string[]
    prompt?: string
  }
) => Promise<void>
```

**触发时机**: 会话压缩前，压缩触发时

**文件位置**: `packages/opencode/src/session/compaction.ts` (行 195)

---

## Input 详解

```typescript
input: {
  sessionID: string  // 会话ID
}
```

---

## Output 详解

```typescript
output: {
  context: string[],   // 附加的上下文字符串数组
  prompt?: string      // 如果设置，完全替换默认压缩提示
}
```

---

## 使用场景

### 1. 添加压缩上下文
```typescript
"experimental.session.compacting": async (input, output) => {
  output.context.push("This is important context for the session.")
}
```

### 2. 完全自定义压缩提示
```typescript
"experimental.session.compacting": async (input, output) => {
  output.prompt = "Please summarize the key points of this conversation."
}
```

---

## 注意事项

- 这是实验性 Hook
- `context` 会附加到默认压缩提示
- 如果设置 `prompt`，会完全替换默认提示
