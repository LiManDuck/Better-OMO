# tool.definition Hook 详解

## Hook 定义

```typescript
"tool.definition"?: (
  input: { toolID: string },
  output: { 
    description: string
    parameters: any
  }
) => Promise<void>
```

**触发时机**: 工具定义发送给 LLM 前，工具注册阶段

**文件位置**: `packages/opencode/src/tool/registry.ts` (行 163)

---

## Input 详解

```typescript
input: {
  toolID: string  // 工具ID (如 "bash", "read", "edit")
}
```

---

## Output 详解

```typescript
output: {
  description: string,  // 工具描述
  parameters: any       // 工具参数定义 (Zod schema)
}
```

---

## 使用场景

### 1. 修改工具描述
```typescript
"tool.definition": async (input, output) => {
  if (input.toolID === "bash") {
    output.description = "Execute shell commands with caution."
  }
}
```

### 2. 动态修改参数
```typescript
"tool.definition": async (input, output) => {
  if (input.toolID === "bash") {
    // 可以修改参数定义
  }
}
```

---

## 注意事项

- 此 Hook 在工具定义发送给 LLM 前触发
- 可以修改工具的描述和参数定义
- 谨慎使用，避免破坏工具功能
