# shell.env Hook 详解

## Hook 定义

```typescript
"shell.env"?: (
  input: { 
    cwd: string
    sessionID?: string
    callID?: string 
  },
  output: { 
    env: Record<string, string>
  }
) => Promise<void>
```

**触发时机**: Shell 环境准备时，启动子进程前

**文件位置**: 
- `packages/opencode/src/tool/bash.ts` (行 187)
- `packages/opencode/src/pty/index.ts` (行 129)

---

## Input 详解

```typescript
input: {
  cwd: string,           // 当前工作目录
  sessionID?: string,    // 会话ID (可选)
  callID?: string        // 调用ID (可选)
}
```

---

## Output 详解

```typescript
output: {
  env: Record<string, string>  // 环境变量
}
```

**默认 env**: `{}` (空对象，会与 process.env 合并)

---

## 使用场景

### 1. 添加自定义环境变量
```typescript
"shell.env": async (input, output) => {
  output.env.CUSTOM_VAR = "custom-value"
}
```

### 2. 设置代理
```typescript
"shell.env": async (input, output) => {
  output.env.HTTP_PROXY = "http://proxy.example.com:8080"
  output.env.HTTPS_PROXY = "http://proxy.example.com:8080"
}
```

### 3. 添加路径
```typescript
"shell.env": async (input, output) => {
  output.env.PATH = "/custom/path:" + output.env.PATH
}
```

---

## 注意事项

- 环境变量会传递给所有 bash/shell 命令
- 优先级高于 process.env
- 谨慎修改，避免影响系统命令
