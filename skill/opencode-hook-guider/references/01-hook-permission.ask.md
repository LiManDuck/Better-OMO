# permission.ask Hook 详解

## Hook 定义

```typescript
"permission.ask"?: (
  input: Permission,
  output: { status: "ask" | "deny" | "allow" }
) => Promise<void>
```

**触发时机**: 权限请求时，权限弹窗前

**文件位置**: `packages/plugin/src/index.ts`

---

## Input 详解 (Permission 类型)

```typescript
interface Permission {
  permission: string    // 权限类型: read, edit, bash, glob, grep, etc.
  patterns: string[]    // 匹配的路径模式
  always: string[]      // 总是允许的模式
  metadata: any         // 额外元数据
}
```

**常见的 permission 类型**:
- `read` - 读取文件/目录
- `edit` - 编辑文件
- `bash` - 执行 shell 命令
- `glob` - 文件搜索
- `grep` - 内容搜索
- `webfetch` - 网页抓取
- `websearch` - 网页搜索
- `codesearch` - 代码搜索
- `skill` - 加载技能
- `task` - 调用子代理
- `todowrite` - 写入待办
- `todoread` - 读取待办
- `list` - 列出目录
- `lsp` - 语言服务
- `external_directory` - 外部目录访问

---

## Output 详解

```typescript
output: {
  status: "ask" | "deny" | "allow"  // 权限决定
}
```

- `ask`: 询问用户 (默认)
- `deny`: 拒绝请求
- `allow`: 允许请求

---

## 使用场景

### 1. 自动允许特定模式
```typescript
"permission.ask": async (input, output) => {
  // 自动允许读取项目目录下的文件
  if (input.permission === "read") {
    output.status = "allow"
  }
}
```

### 2. 自动拒绝危险操作
```typescript
"permission.ask": async (input, output) => {
  // 禁止删除操作
  if (input.permission === "bash" && input.patterns.some(p => p.includes("rm -rf"))) {
    output.status = "deny"
  }
}
```

---

## 注意事项

- 修改 `output.status` 会直接影响权限请求结果
- 设置为 "allow" 或 "deny" 会跳过用户弹窗
- 谨慎使用自动 allow，可能存在安全风险
