# command.execute.before Hook 详解

## Hook 定义

```typescript
"command.execute.before"?: (
  input: { 
    command: string
    sessionID: string
    arguments: string 
  },
  output: { 
    parts: Part[]
  }
) => Promise<void>
```

**触发时机**: 执行命令前，命令运行前

**文件位置**: `packages/opencode/src/session/prompt.ts` (行 1921)

---

## Input 详解

```typescript
input: {
  command: string,      // 命令名称 (如 "/explain", "/test")
  sessionID: string,    // 会话ID
  arguments: string    // 命令参数
}
```

---

## Output 详解

```typescript
output: {
  parts: Part[]         // 命令执行时的消息部分
}
```

---

## 使用场景

### 1. 命令参数处理
```typescript
"command.execute.before": async (input, output) => {
  console.log(`Executing command: ${input.command}`)
  console.log(`Arguments: ${input.arguments}`)
}
```

### 2. 命令日志记录
```typescript
"command.execute.before": async (input, output) => {
  // 记录命令执行日志
}
```

---

## 注意事项

- 此 Hook 在命令执行前触发
- `parts` 会作为消息发送给 LLM
