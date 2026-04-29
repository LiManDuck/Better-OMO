# tool.execute.after Hook 详解

## Hook 定义

```typescript
"tool.execute.after"?: (
  input: {
    tool: string           // 工具名称
    sessionID: string      // 会话ID
    callID: string         // 调用ID
    args: any             // 工具执行时的参数
  },
  output: {
    title: string          // 工具执行结果的标题
    output: string        // 工具执行的结果输出
    metadata: any         // 工具执行的元数据
  }
) => Promise<void>
```

**文件位置**: `packages/opencode/src/tool/*.ts`

---

## 各工具 metadata 详细结构

### 1. bash (shell 命令执行)

**文件位置**: `packages/opencode/src/tool/bash.ts`

```typescript
metadata: {
  output: string,        // 命令输出（最大30000字符，超出被截断）
  exit: number,          // 进程退出码
  description: string   // 用户提供的命令描述
}
```

**入参**:
```typescript
args: {
  command: string,       // 要执行的命令
  timeout?: number,      // 超时时间（毫秒）
  workdir?: string,      // 工作目录
  description: string   // 命令描述
}
```

---

### 2. read (文件读取)

**文件位置**: `packages/opencode/src/tool/read.ts`

```typescript
metadata: {
  preview: string,       // 前20行的预览内容
  truncated: boolean,   // 是否被截断
  loaded: string[]      // 加载的指令文件路径数组
}
```

**入参**:
```typescript
args: {
  filePath: string,      // 文件绝对路径
  offset?: number,       // 起始行号（1-indexed）
  limit?: number        // 最大行数（默认2000）
}
```

---

### 3. write (文件写入)

**文件位置**: `packages/opencode/src/tool/write.ts`

```typescript
metadata: {
  diagnostics: Record<string, LSP.Diagnostic[]>, // LSP诊断信息
  filepath: string,        // 文件绝对路径
  exists: boolean         // 文件是否已存在
}
```

**入参**:
```typescript
args: {
  filePath: string,      // 文件绝对路径
  content: string       // 要写入的内容
}
```

---

### 4. edit (文件编辑)

**文件位置**: `packages/opencode/src/tool/edit.ts`

```typescript
metadata: {
  diagnostics: Record<string, LSP.Diagnostic[]>, // LSP诊断信息
  diff: string,                                    // 差异内容（unified diff格式）
  filediff: Snapshot.FileDiff                     // 文件差异对象
}
```

**类型定义**:
```typescript
interface FileDiff {
  file: string,                      // 文件路径
  before: string,                    // 修改前内容
  after: string,                     // 修改后内容
  additions: number,                 // 新增行数
  deletions: number,                 // 删除行数
  status?: "added" | "deleted" | "modified"  // 文件状态
}
```

**入参**:
```typescript
args: {
  filePath: string,      // 文件绝对路径
  oldString: string,    // 要替换的文本
  newString: string,    // 替换后的文本
  replaceAll?: boolean  // 是否全部替换
}
```

---

### 5. task (子代理调用)

**文件位置**: `packages/opencode/src/tool/task.ts`

```typescript
metadata: {
  sessionId: string,    // 子会话ID（用于恢复会话）
  model: {             // 模型信息
    modelID: string,
    providerID: string
  }
}
```

**入参**:
```typescript
args: {
  description: string,  // 任务描述（3-5词）
  prompt: string,       // 任务指令
  subagent_type: string, // 子代理类型
  task_id?: string,     // 可选：恢复已有任务
  command?: string      // 触发此任务的命令
}
```

---

### 6. glob (文件搜索)

**文件位置**: `packages/opencode/src/tool/glob.ts`

```typescript
metadata: {
  count: number,        // 找到的文件数量
  truncated: boolean,  // 是否被截断（默认限制100个）
  searchPaths: number  // 搜索的路径数量
}
```

**入参**:
```typescript
args: {
  pattern: string,      // glob 模式
  path?: string         // 可选的搜索目录
}
```

---

### 7. grep (内容搜索)

**文件位置**: `packages/opencode/src/tool/grep.ts`

```typescript
metadata: {
  matches: number,      // 匹配数量
  truncated: boolean,  // 是否被截断
  searchPaths: number  // 搜索路径数量
}
```

**入参**:
```typescript
args: {
  pattern: string,      // 正则表达式
  path?: string,        // 可选的搜索目录
  include?: string      // 文件过滤模式（如 "*.ts"）
}
```

---

### 8. question (用户交互)

**文件位置**: `packages/opencode/src/tool/question.ts`

```typescript
metadata: {
  answers: Array<Array<string>>  // 用户答案数组（每个问题可能有多个答案）
}
```

**入参**:
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

---

### 9. webfetch (网页获取)

**文件位置**: `packages/opencode/src/tool/webfetch.ts`

```typescript
metadata: {}  // 空对象
```

**入参**:
```typescript
args: {
  url: string,                    // 目标URL
  format?: "text" | "markdown" | "html",  // 返回格式
  timeout?: number                // 超时秒数（最大120）
}
```

---

### 10. websearch (网页搜索)

**文件位置**: `packages/opencode/src/tool/websearch.ts`

```typescript
metadata: {}  // 空对象
```

**入参**:
```typescript
args: {
  query: string,                              // 搜索关键词
  numResults?: number,                        // 结果数量（默认8）
  livecrawl?: "fallback" | "preferred",       // 实时抓取模式
  type?: "auto" | "fast" | "deep",           // 搜索类型
  contextMaxCharacters?: number              // 上下文最大字符数
}
```

---

### 11. codesearch (代码搜索)

**文件位置**: `packages/opencode/src/tool/codesearch.ts`

```typescript
metadata: {}  // 空对象
```

**入参**:
```typescript
args: {
  query: string,        // 搜索查询
  tokensNum?: number    // 返回token数（1000-50000，默认5000）
}
```

---

### 12. skill (技能加载)

**文件位置**: `packages/opencode/src/tool/skill.ts`

```typescript
metadata: {
  name: string,   // 技能名称
  dir: string    // 技能目录路径
}
```

**入参**:
```typescript
args: {
  name: string   // 技能名称
}
```

---

### 13. todowrite (待办写入)

**文件位置**: `packages/opencode/src/tool/todo.ts`

```typescript
metadata: {
  todos: Array<{
    content: string,                      // 任务描述
    status: "pending" | "in_progress" | "completed" | "cancelled",
    priority: "high" | "medium" | "low"
  }>
}
```

**入参**:
```typescript
args: {
  todos: Array<{
    content: string,
    status: string,
    priority: string
  }>
}
```

---

### 14. todoread (待办读取)

**文件位置**: `packages/opencode/src/tool/todo.ts`

```typescript
metadata: {
  todos: Array<{
    content: string,
    status: "pending" | "in_progress" | "completed" | "cancelled",
    priority: "high" | "medium" | "low"
  }>
}
```

**入参**:
```typescript
args: {}  // 无参数
```

---

### 15. ls (目录列表)

**文件位置**: `packages/opencode/src/tool/ls.ts`

```typescript
metadata: {
  count: number,       // 文件数量
  truncated: boolean  // 是否被截断（默认限制100个）
}
```

**入参**:
```typescript
args: {
  path?: string,              // 目录路径（绝对路径）
  ignore?: string[]           // 忽略的glob模式
}
```

---

### 16. lsp (语言服务)

**文件位置**: `packages/opencode/src/tool/lsp.ts`

```typescript
metadata: {
  result: unknown[]  // LSP操作结果数组
}
```

**入参**:
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

---

### 17. apply_patch (补丁应用)

**文件位置**: `packages/opencode/src/tool/apply_patch.ts`

```typescript
metadata: {
  diff: string,                                    // 总差异内容
  files: Array<{
    filePath: string,        // 文件路径
    relativePath: string,   // 相对路径
    type: "add" | "update" | "delete" | "move",  // 操作类型
    diff: string,           // 文件差异
    before: string,         // 修改前内容
    after: string,          // 修改后内容
    additions: number,     // 新增行数
    deletions: number,     // 删除行数
    movePath?: string      // 移动目标路径
  }>,
  diagnostics: Record<string, LSP.Diagnostic[]>  // LSP诊断信息
}
```

**入参**:
```typescript
args: {
  patchText: string   // 补丁文本
}
```

---

### 18. multiedit (多次编辑)

**文件位置**: `packages/opencode/src/tool/multiedit.ts`

```typescript
metadata: {
  results: Array<{
    diagnostics: Record<string, LSP.Diagnostic[]>,
    diff: string,
    filediff: Snapshot.FileDiff
  }>
}
```

**入参**:
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

---

### 19. batch (批量执行)

**文件位置**: `packages/opencode/src/tool/batch.ts`

```typescript
metadata: {
  totalCalls: number,                    // 总调用数
  successful: number,                    // 成功数
  failed: number,                        // 失败数
  tools: string[],                       // 工具名称列表
  details: Array<{                       // 详细结果
    tool: string,
    success: boolean
  }>
}
```

**入参**:
```typescript
args: {
  tool_calls: Array<{
    tool: string,
    parameters: object
  }>
}
```

---

### 20. plan_exit (计划退出)

**文件位置**: `packages/opencode/src/tool/plan.ts`

```typescript
metadata: {}  // 空对象
```

**入参**:
```typescript
args: {}  // 无参数
```

---

## 总结表

| 工具 | metadata 关键字段 |
|------|------------------|
| bash | `output`, `exit`, `description` |
| read | `preview`, `truncated`, `loaded` |
| write | `diagnostics`, `filepath`, `exists` |
| edit | `diagnostics`, `diff`, `filediff` |
| task | `sessionId`, `model` |
| glob | `count`, `truncated`, `searchPaths` |
| grep | `matches`, `truncated`, `searchPaths` |
| question | `answers` |
| webfetch | `{}` (空对象) |
| websearch | `{}` (空对象) |
| codesearch | `{}` (空对象) |
| skill | `name`, `dir` |
| todowrite | `todos` |
| todoread | `todos` |
| ls | `count`, `truncated` |
| lsp | `result` |
| apply_patch | `diff`, `files`, `diagnostics` |
| multiedit | `results` |
| batch | `totalCalls`, `successful`, `failed`, `tools`, `details` |
| plan_exit | `{}` (空对象) |

---

## 使用场景示例

### 1. logger-custom-tool-timing-cac.ts (工具执行时间记录)
- 根据 `sessionID` 和 `callID` 匹配工具执行的时间信息
- 记录工具执行的耗时、开始时间等

### 2. logger-custom-subagent-call-cac.ts (子代理调用跟踪)
- 仅在 `tool === "task"` 时触发
- 从 `output.metadata.sessionId` 获取子会话ID
- 记录子代理调用的结束时间、调用深度等信息
