# experimental.text.complete Hook 详解

## Hook 定义

```typescript
"experimental.text.complete"?: (
  input: { 
    sessionID: string
    messageID: string
    partID: string 
  },
  output: { 
    text: string
  }
) => Promise<void>
```

**触发时机**: 文本补全时，UI 补全请求

**文件位置**: `packages/opencode/src/session/processor.ts` (行 404)

---

## Input 详解

```typescript
input: {
  sessionID: string,  // 会话ID
  messageID: string,  // 消息ID
  partID: string      // 文本部分ID
}
```

---

## Output 详解

```typescript
output: {
  text: string  // 完整的文本内容
}
```

---

## 使用场景

### 1. 文本后处理
```typescript
"experimental.text.complete": async (input, output) => {
  // 清理文本
  output.text = output.text.trim()
}
```

### 2. 文本格式化
```typescript
"experimental.text.complete": async (input, output) => {
  // 格式化代码块
  output.text = output.text.replace(/```(\w+)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `\`\`\`${lang}\n${code.trim()}\n\`\`\``
  })
}
```

---

## 注意事项

- 这是实验性 Hook
- 文本已经完整，可以进行后处理
- 修改会影响最终显示的文本
