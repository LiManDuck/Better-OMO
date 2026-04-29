# tool.execute.before Hook 详解

## Hook 定义

```typescript
"tool.execute.before"?: (
  input: {
    tool: string           // 工具名称
    sessionID: string      // 会话ID
    callID: string         // 调用ID
  },
  output: {
    args: any             // 工具执行时的参数（可以修改）
  }
) => Promise<void>
```

**特点**: 工具执行**之前**触发，可以通过修改 `output.args` 来改变工具的实际执行参数。

**文件位置**: 
- 触发位置: `packages/opencode/src/session/prompt.ts` (行 419, 823, 878)
- 工具定义: `packages/opencode/src/tool/*.ts`

---

## 各工具 args 参数详细结构

### 1. bash (shell 命令执行)

**文件位置**: `packages/opencode/src/tool/bash.ts`

```typescript
args: {
  command: string,       // 要执行的命令
  timeout?: number,      // 超时时间（毫秒）
  workdir?: string,      // 工作目录
  description: string   // 命令描述
}
```

**可修改字段**: 所有字段都可修改

---

### 2. read (文件读取)

**文件位置**: `packages/opencode/src/tool/read.ts`

```typescript
args: {
  filePath: string,      // 文件绝对路径
  offset?: number,       // 起始行号（1-indexed）
  limit?: number        // 最大行数（默认2000）
}
```

**可修改字段**: 所有字段都可修改

---

### 3. write (文件写入)

**文件位置**: `packages/opencode/src/tool/write.ts`

```typescript
args: {
  filePath: string,      // 文件绝对路径
  content: string       // 要写入的内容
}
```

**可修改字段**: 所有字段都可修改

---

### 4. edit (文件编辑)

**文件位置**: `packages/opencode/src/tool/edit.ts`

```typescript
args: {
  filePath: string,      // 文件绝对路径
  oldString: string,    // 要替换的文本
  newString: string,    // 替换后的文本
  replaceAll?: boolean  // 是否全部替换
}
```

**可修改字段**: 所有字段都可修改

---

### 5. task (子代理调用)

**文件位置**: `packages/opencode/src/tool/task.ts`

```typescript
args: {
  description: string,  // 任务描述（3-5词）
  prompt: string,       // 任务指令
  subagent_type: string, // 子代理类型
  task_id?: string,     // 可选：恢复已有任务
  command?: string      // 触发此任务的命令
}
```

**可修改字段**: 所有字段都可修改

---

### 6. glob (文件搜索)

**文件位置**: `packages/opencode/src/tool/glob.ts`

```typescript
args: {
  pattern: string,      // glob 模式
  path?: string         // 可选的搜索目录
}
```

**可修改字段**: 所有字段都可修改

---

### 7. grep (内容搜索)

**文件位置**: `packages/opencode/src/tool/grep.ts`

```typescript
args: {
  pattern: string,      // 正则表达式
  path?: string,        // 可选的搜索目录
  include?: string      // 文件过滤模式（如 "*.ts"）
}
```

**可修改字段**: 所有字段都可修改

---

### 8. question (用户交互)

**文件位置**: `packages/opencode/src/tool/question.ts`

```typescript
args: {
  questions: Array<{
    question: string,   // 问题内容
    header: string,     // 问题标题
    options: Array<{
      label: string,
      description: string
    }>,
    multiple?: boolean  // 是否允许多选
  }>
}
```

**可修改字段**: 所有字段都可修改

---

### 9. webfetch (网页获取)

**文件位置**: `packages/opencode/src/tool/webfetch.ts`

```typescript
args: {
  url: string,                    // 目标URL
  format?: "text" | "markdown" | "html",  // 返回格式
  timeout?: number                // 超时秒数（最大120）
}
```

**可修改字段**: 所有字段都可修改

---

### 10. websearch (网页搜索)

**文件位置**: `packages/opencode/src/tool/websearch.ts`

```typescript
args: {
  query: string,                              // 搜索关键词
  numResults?: number,                        // 结果数量（默认8）
  livecrawl?: "fallback" | "preferred",       // 实时抓取模式
  type?: "auto" | "fast" | "deep",           // 搜索类型
  contextMaxCharacters?: number              // 上下文最大字符数
}
```

**可修改字段**: 所有字段都可修改

---

### 11. codesearch (代码搜索)

**文件位置**: `packages/opencode/src/tool/codesearch.ts`

```typescript
args: {
  query: string,        // 搜索查询
  tokensNum?: number    // 返回token数（1000-50000，默认5000）
}
```

**可修改字段**: 所有字段都可修改

---

### 12. skill (技能加载)

**文件位置**: `packages/opencode/src/tool/skill.ts`

```typescript
args: {
  name: string   // 技能名称
}
```

**可修改字段**: `name` 可修改

---

### 13. todowrite (待办写入)

**文件位置**: `packages/opencode/src/tool/todo.ts`

```typescript
args: {
  todos: Array<{
    content: string,
    status: string,
    priority: string
  }>
}
```

**可修改字段**: `todos` 可修改

---

### 14. todoread (待办读取)

**文件位置**: `packages/opencode/src/tool/todo.ts`

```typescript
args: {}  // 无参数
```

**可修改字段**: 无

---

### 15. ls (目录列表)

文件**位置**: `packages/opencode/src/tool/ls.ts`

```typescript
args: {
  path?: string,              // 目录路径（绝对路径）
  ignore?: string[]           // 忽略的glob模式
}
```

**可修改字段**: 所有字段都可修改

---

### 16. lsp (语言服务)

**文件位置**: `packages/opencode/src/tool/lsp.ts`

```typescript
args: {
  operation: "goToDefinition" | "findReferences" | "hover" | "documentSymbol" | 
              "workspaceSymbol" | "goToImplementation" | "prepareCallHierarchy" | 
              "incomingCalls" | "outgoingCalls",
  filePath: string,
  line: number,
  character: number
}
```

**可修改字段**: 所有字段都可修改

---

### 17. apply_patch (补丁应用)

**文件位置**: `packages/opencode/src/tool/apply_patch.ts`

```typescript
args: {
  patchText: string   // 补丁文本
}
```

**可修改字段**: `patchText` 可修改

---

### 18. multiedit (多次编辑)

**文件位置**: `packages/opencode/src/tool/multiedit.ts`

```typescript
args: {
  filePath: string,
  edits: Array<{
    filePath: string,
    oldString: string,
    newString: string,
    replaceAll?: boolean
  }>
}
```

**可修改字段**: 所有字段都可修改

---

### 19. batch (批量执行)

**文件位置**: `packages/opencode/src/tool/batch.ts`

```typescript
args: {
  tool_calls: Array<{
    tool: string,
    parameters: object
  }>
}
```

**可修改字段**: `tool_calls` 可修改

---

### 20. plan_exit (计划退出)

**文件位置**: `packages/opencode/src/tool/plan.ts`

```typescript
args: {}  // 无参数
```

**可修改字段**: 无

---

## 总结表

| 工具 | args 关键字段 |
|------|--------------|
| bash | `command`, `timeout`, `workdir`, `description` |
| read | `filePath`, `offset`, `limit` |
| write | `filePath`, `content` |
| edit | `filePath`, `oldString`, `newString`, `replaceAll` |
| task | `description`, `prompt`, `subagent_type`, `task_id`, `command` |
| glob | `pattern`, `path` |
| grep | `pattern`, `path`, `include` |
| question | `questions` |
| webfetch | `url`, `format`, `timeout` |
| websearch | `query`, `numResults`, `livecrawl`, `type`, `contextMaxCharacters` |
| codesearch | `query`, `tokensNum` |
| skill | `name` |
| todowrite | `todos` |
| todoread | `{}` (无参数) |
| ls | `path`, `ignore` |
| lsp | `operation`, `filePath`, `line`, `character` |
| apply_patch | `patchText` |
| multiedit | `filePath`, `edits` |
| batch | `tool_calls` |
| plan_exit | `{}` (无参数) |

---

## 与 tool.execute.after 的区别

| 特性 | tool.execute.before | tool.execute.after |
|------|---------------------|-------------------|
| 触发时机 | 工具执行前 | 工具执行后 |
| output.args | 工具参数（可修改） | 不适用 |
| output.metadata | 不适用 | 工具执行结果元数据 |
| 用途 | 参数验证/修改/日志 | 结果记录/分析 |

---

## 使用场景示例

### 1. 参数验证与修改
- 限制 bash 命令的超时时间，防止过长运行
- 修改 glob 搜索的路径，限制搜索范围
- 为 read 工具添加默认 offset 或 limit

### 2. 日志记录
- 在工具执行前记录开始时间
- 记录调用深度等信息

### 3. 安全控制
- 过滤敏感命令
- 阻止危险操作
