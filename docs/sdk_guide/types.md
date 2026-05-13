# SDK 类型定义参考

本文档列出了 OpenCode SDK 中所有主要的类型定义。这些类型主要由 OpenAPI 规范自动生成，位于 `packages/sdk/js/src/gen/types.gen.ts`。

## 事件类型

### Event

全局事件类型，包含所有可能的事件。

```typescript
type Event =
  | EventServerInstanceDisposed      // 服务器实例已释放
  | EventInstallationUpdated            // 安装已更新
  | EventInstallationUpdateAvailable     // 有可用更新
  | EventLspClientDiagnostics        // LSP 客户端诊断信息
  | EventLspUpdated                  // LSP 已更新
  | EventMessageUpdated                // 消息已更新
  | EventMessageRemoved                // 消息已删除
  | EventMessagePartUpdated           // 消息部分已更新
  | EventMessagePartRemoved           // 消息部分已删除
  | EventPermissionUpdated             // 权限已更新
  | EventPermissionReplied             // 权限已回复
  | EventSessionStatus                // 会话状态
  | EventSessionIdle                  // 会话空闲
  | EventSessionCompacted             // 会话已压缩
  | EventFileEdited                   // 文件已编辑
  | EventTodoUpdated                  // 待办事项已更新
  | EventCommandExecuted             // 命令已执行
  | EventSessionCreated              // 会话已创建
  | EventSessionUpdated              // 会话已更新
  | EventSessionDeleted              // 会话已删除
  | EventSessionDiff                 // 会话差异
  | EventSessionError                // 会话错误
  | EventFileWatcherUpdated           // 文件监视器已更新
  | EventVcsBranchUpdated            // VCS 分支已更新
  | EventTuiPromptAppend            // TUI 提示已追加
  | EventTuiCommandExecute           // TUI 命令已执行
  | EventTuiToastShow               // TUI Toast 已显示
  | EventPtyCreated                 // PTY 已创建
  | EventPtyUpdated                 // PTY 已更新
  | EventPtyExited                  // PTY 已退出
  | EventPtyDeleted                 // PTY 已删除
  | EventServerConnected             // 服务器已连接
  | EventLoginSuccess                // 登录成功
```

### GlobalEvent

全局事件类型，包含目录信息。

```typescript
type GlobalEvent = {
  directory: string    // 目录路径
  payload: Event       // 事件负载
}
```

### EventServerInstanceDisposed

服务器实例释放事件。

```typescript
type EventServerInstanceDisposed = {
  type: "server.instance.disposed"
  properties: {
    directory: string  // 目录路径
  }
}
```

### EventInstallationUpdated

安装更新事件。

```typescript
type EventInstallationUpdated = {
  type: "installation.updated"
  properties: {
    version: string  // 版本号
  }
}
```

### EventLspClientDiagnostics

LSP 客户端诊断事件。

```typescript
type EventLspClientDiagnostics = {
  type: "lsp.client.diagnostics"
  properties: {
    serverID: string  // LSP 服务器 ID
    path: string      // 文件路径
  }
}
```

### EventMessageUpdated

消息更新事件。

```typescript
type EventMessageUpdated = {
  type: "message.updated"
  properties: {
    info: Message  // 消息信息
  }
}
```

### EventPermissionUpdated

权限更新事件。

```typescript
type EventPermissionUpdated = {
  type: "permission.updated"
  properties: Permission
}
```

### EventSessionStatus

会话状态事件。

```typescript
type EventSessionStatus = {
  type: "session.status"
  properties: {
    sessionID: string    // 会话 ID
    status: SessionStatus  // 会话状态
  }
}

type SessionStatus =
  | { type: "idle" }                          // 空闲
  | { type: "retry"; attempt: number; message: string; next: number }  // 重试中
  | { type: "busy" }                          // 忙碌
```

### EventTodoUpdated

待办事项更新事件。

```typescript
type EventTodoUpdated = {
  type: "todo.updated"
  properties: {
    sessionID: string   // 会话 ID
    todos: Array<Todo>  // 待办事项列表
  }
}

type Todo = {
  content: string    // 任务描述
  status: string     // 状态: pending, in_progress, completed, cancelled
  priority: string   // 优先级: high, medium, low
  id: string        // 唯一标识符
}
```

### EventTuiToastShow

TUI Toast 显示事件。

```typescript
type EventTuiToastShow = {
  type: "tui.toast.show"
  properties: {
    title?: string                    // 标题
    message: string                   // 消息内容
    variant: "info" | "success" | "warning" | "error"  // 变体
    duration?: number                 // 持续时间（毫秒）
  }
}
```

## 消息类型

### Message

消息类型，可以是用户消息或助手消息。

```typescript
type Message = UserMessage | AssistantMessage
```

### UserMessage

用户消息类型。

```typescript
type UserMessage = {
  id: string
  sessionID: string
  role: "user"
  time: {
    created: number      // 创建时间戳
  }
  summary?: {
    title?: string              // 标题
    body?: string               // 正文
    diffs: Array<FileDiff>     // 差异列表
  }
  agent: string               // 使用的 agent
  model: {
    providerID: string        // Provider ID
    modelID: string           // Model ID
  }
  system?: string             // 系统提示
  tools?: {
    [key: string]: boolean   // 工具启用/禁用状态
  }
}
```

### AssistantMessage

助手消息类型。

```typescript
type AssistantMessage = {
  id: string
  sessionID: string
  role: "assistant"
  time: {
    created: number          // 创建时间戳
    completed?: number        // 完成时间戳
  }
  error?: ProviderAuthError | UnknownError | MessageOutputLengthError | MessageAbortedError | ApiError
  parentID: string            // 父消息 ID
  modelID: string              // Model ID
  providerID: string           // Provider ID
  mode: string                 // 模式
  path: {
    cwd: string  // 当前工作目录
    root: string // 项目根目录
  }
  summary?: boolean             // 是否为摘要
  cost: number                 // 成本
  tokens: {
    input: number             // 输入 token 数
    output: number            // 输出 token 数
    reasoning: number          // 推理 token 数
    cache: {
      read: number         // 缓存读取数量
      write: number        // 缓存写入数量
    }
  }
  finish?: string              // 完成原因
}
```

### FileDiff

文件差异类型。

```typescript
type FileDiff = {
  file: string              // 文件路径
  before: string           // 之前内容
  after: string            // 之后内容
  additions: number        // 新增行数
  deletions: number        // 删除行数
}
```

## Part 类型

### Part

消息部分的联合类型。

```typescript
type Part =
  | TextPart              // 文本部分
  | SubtaskPart           // 子任务部分
  | ReasoningPart         // 推理部分
  | FilePart              // 文件部分
  | ToolPart              // 工具部分
  | StepStartPart         // 步骤开始部分
  | StepFinishPart        // 步骤完成部分
  | SnapshotPart          // 快照部分
  | PatchPart             // 补丁部分
  | AgentPart             // Agent 部分
  | RetryPart             // 重试部分
  | CompactionPart        // 压缩部分
```

### TextPart

文本部分类型。

```typescript
type TextPart = {
  id: string
  sessionID: string
  messageID: string
  type: "text"
  text: string
  synthetic?: boolean     // 是否为合成文本
  ignored?: boolean      // 是否被忽略
  time?: {
    start: number       // 开始时间戳
    end?: number         // 结束时间戳
  }
  metadata?: {
    [key: string]: unknown  // 元数据
  }
}
```

### SubtaskPart

子任务部分类型。

```typescript
type SubtaskPart = {
  id: string
  sessionID: string
  messageID: string
  type: "subtask"
  prompt: string         // 提示文本
  description: string    // 描述
  agent: string         // 使用的 agent
}
```

### ToolPart

工具部分类型。

```typescript
type ToolPart = {
  id: string
  sessionID: string
  messageID: string
  type: "tool"
  callID: string         // 调用 ID
  tool: string           // 工具名称
  state: ToolState      // 工具状态
  metadata?: {
    [key: string]: unknown  // 元数据
  }
}

type ToolState =
  | ToolStatePending     // 待处理
  | ToolStateRunning     // 运行中
  | ToolStateCompleted   // 已完成
  | ToolStateError       // 错误

type ToolStatePending = {
  status: "pending"
  input: { [key: string]: unknown }
  raw: string
}

type ToolStateRunning = {
  status: "running"
  input: { [key: string]: unknown }
  title?: string
  metadata?: { [key: string]: unknown }
  time: { start: number }
}

type ToolStateCompleted = {
  status: "completed"
  input: { [key: string]: unknown }
  output: string
  title: string
  metadata: { [key: string]: unknown }
  time: {
    start: number
    end: number
    compacted?: number
  }
  attachments?: Array<FilePart>
}

type ToolStateError = {
  status: "error"
  input: { [key: string]: unknown }
  error: string
  metadata?: { [key: string]: unknown }
  time: { start: number; end: number }
}
```

## 错误类型

### ProviderAuthError

Provider 认证错误。

```typescript
type ProviderAuthError = {
  name: "ProviderAuthError"
  data: {
    providerID: string
    message: string
  }
}
```

### UnknownError

未知错误。

```typescript
type UnknownError = {
  name: "UnknownError"
  data: {
    message: string
  }
}
```

### MessageOutputLengthError

消息输出长度错误。

```typescript
type MessageOutputLengthError = {
  name: "MessageOutputLengthError"
  data: {
    [key: string]: unknown
  }
}
```

### MessageAbortedError

消息中止错误。

```typescript
type MessageAbortedError = {
  name: "MessageAbortedError"
  data: {
    message: string
  }
}
```

### ApiError

API 错误。

```typescript
type ApiError = {
  name: "APIError"
  data: {
    message: string
    statusCode?: number
    isRetryable: boolean
    responseHeaders?: {
      [key: string]: string
    }
    responseBody?: string
  }
}
```

## 配置类型

### Config

OpenCode 主配置类型。

```typescript
type Config = {
  $schema?: string                        // JSON schema 引用
  theme?: string                           // 主题名称
  keybinds?: KeybindsConfig                // 键绑定配置
  logLevel?: "DEBUG" | "INFO" | "WARN" | "ERROR"
  tui?: {                                 // TUI 配置
    scroll_speed?: number                    // 滚动速度
    scroll_acceleration?: {                   // 滚动加速
      enabled: boolean
    }
    diff_style?: "auto" | "stacked"          // 差异风格
  }
  command?: {                               // 命令配置
    [key: string]: {
      template: string
      description?: string
      agent?: string
      model?: string
      subtask?: boolean
    }
  }
  watcher?: {                                // 文件监视器配置
    ignore?: Array<string>
  }
  plugin?: Array<string>                     // 插件列表
  snapshot?: boolean                         // 是否创建快照
  share?: "manual" | "auto" | "disabled" // 分享行为
  autoshare?: boolean                      // (已弃用) 自动分享
  autoupdate?: boolean | "notify"        // 自动更新
  disabled_providers?: Array<string>          // 禁用的 providers
  enabled_providers?: Array<string>           // 仅启用的 providers
  model?: string                            // 默认模型 (provider/model)
  small_model?: string                       // 小模型 (provider/model)
  username?: string                          // 自定义用户名
  mode?: {                                // (已弃用) 模式配置
    [key: string]: AgentConfig
  }
  agent?: {                                 // Agent 配置
    [key: string]: AgentConfig
  }
  provider?: {                              // Provider 配置
    [key: string]: ProviderConfig
  }
  mcp?: {                                   // MCP 配置
    [key: string]: McpLocalConfig | McpRemoteConfig
  }
  formatter?:                                // Formatter 配置
    | false
    | {
        [key: string]: {
          disabled?: boolean
          command?: Array<string>
          environment?: { [key: string]: string }
          extensions?: Array<string>
        }
      }
  lsp?:                                      // LSP 配置
    | false
    | {
        [key: string]:
          | { disabled: true }
          | {
              command: Array<string>
              extensions?: Array<string>
              disabled?: boolean
              env?: { [key: string]: string }
              initialization?: { [key: string]: unknown }
            }
      }
  instructions?: Array<string>                // 指令文件列表
  layout?: "auto" | "stretch"              // (已弃用) 布局
  permission?: {                              // 权限配置
    edit?: "ask" | "allow" | "deny"
    bash?: ("ask" | "allow" | "deny") | { [key: string]: "ask" | "allow" | "deny" }
    webfetch?: "ask" | "allow" | "deny"
    doom_loop?: "ask" | "allow" | "deny"
    external_directory?: "ask" | "allow" | "deny"
  }
  tools?: {                                  // 工具配置
    [key: string]: boolean
  }
  enterprise?: {                               // 企业配置
    url?: string
  }
  experimental?: {                             // 实验功能
    hook?: {
      file_edited?: {
        [key: string]: Array<{
          command: Array<string>
          environment?: { [key: string]: string }
        }>
      }
      session_completed?: Array<{
        command: Array<string>
        environment?: { [key: string]: string }
      }>
    }
    chatMaxRetries?: number                // 聊天最大重试次数
    disable_paste_summary?: boolean
    batch_tool?: boolean                   // 启用 batch 工具
    openTelemetry?: boolean              // 启用 OpenTelemetry spans
    primary_tools?: Array<string>        // 仅对 primary agents 可用的工具
  }
}
```

### AgentConfig

Agent 配置类型。

```typescript
type AgentConfig = {
  model?: string                         // 模型 (provider/model)
  temperature?: number                     // 温度参数
  top_p?: number                        // Top p 参数
  prompt?: string                         // 提示模板
  tools?: {
    [key: string]: boolean             // 工具启用/禁用状态
  }
  disable?: boolean                        // 是否禁用 agent
  description?: string                     // 使用描述
  mode?: "subagent" | "primary" | "all"  // Agent 模式
  color?: string                         // Hex 颜色代码 (如 #FF5733)
  maxSteps?: number                       // 最大迭代次数
  permission?: {                          // 权限配置
    edit?: "ask" | "allow" | "deny"
    bash?: ("ask" | "allow" | "deny") | { [key: string]: "ask" | "allow" | "deny" }
    webfetch?: "ask" | "allow" | "deny"
    doom_loop?: "ask" | "allow" | "deny"
    external_directory?: "ask" | "allow" | "deny"
  }
  [key: string]: any                      // 其他 agent 配置
}
```

### ProviderConfig

Provider 配置类型。

```typescript
type ProviderConfig = {
  api?: string                           // API 端点
  name?: string                           // Provider 名称
  env?: Array<string>                     // 环境变量
  id?: string                             // Provider ID
  npm?: string                            // NPM 包名
  models?: {                              // 模型配置
    [key: string]: {
      id?: string                    // Model ID
      name?: string                  // 模型名称
      release_date?: string          // 发布日期
      attachment?: boolean            // 是否支持附件
      reasoning?: boolean            // 是否支持推理
      temperature?: boolean           // 是否支持温度参数
      tool_call?: boolean            // 是否支持工具调用
      cost?: {                      // 成本配置
        input: number
        output: number
        cache_read?: number
        cache_write?: number
        context_over_200k?: {
          input: number
          output: number
          cache_read?: number
          cache_write?: number
        }
      }
      limit?: {                      // 限制
        context: number               // 上下文限制
        output: number                // 输出限制
      }
      modalities?: {                 // 模态
        input: Array<"text" | "audio" | "image" | "video" | "pdf">
        output: Array<"text" | "audio" | "image" | "video" | "pdf">
      }
      experimental?: boolean            // 是否为实验性
      status?: "alpha" | "beta" | "deprecated"
      options?: { [key: string]: unknown }
      headers?: { [key: string]: string }
      provider?: { npm: string }
    }
  }
  whitelist?: Array<string>                 // 白名单
  blacklist?: Array<string>                 // 黑名单
  options?: {                              // 选项
    apiKey?: string
    baseURL?: string
    enterpriseUrl?: string            // GitHub Enterprise URL
    setCacheKey?: boolean           // 启用提示缓存键
    timeout?: number | false        // 请求超时（毫秒）
    [key: string]: unknown
  }
}
```

### McpLocalConfig

MCP 本地服务器配置。

```typescript
type McpLocalConfig = {
  type: "local"                           // 类型：本地
  command: Array<string>                    // 运行 MCP server 的命令和参数
  environment?: {                            // 环境变量
    [key: string]: string
  }
  enabled?: boolean                         // 是否在启动时启用
  timeout?: number                           // 获取工具超时（毫秒），默认 5000
}
```

### McpRemoteConfig

MCP 远程服务器配置。

```typescript
type McpRemoteConfig = {
  type: "remote"                           // 类型：远程
  url: string                              // MCP server URL
  enabled?: boolean                         // 是否在启动时启用
  headers?: {                              // 请求头
    [key: string]: string
  }
  oauth?: McpOAuthConfig | false           // OAuth 配置或禁用
  timeout?: number                           // 获取工具超时（毫秒），默认 5000
}

type McpOAuthConfig = {
  clientId?: string                          // OAuth 客户端 ID（如果不提供，尝试动态注册）
  clientSecret?: string                     // OAuth 客户端密钥（如需要）
  scope?: string                            // OAuth 作用域
}
```

### KeybindsConfig

键绑定配置。

```typescript
type KeybindsConfig = {
  leader?: string                            // 前导键
  app_exit?: string                          // 退出应用
  editor_open?: string                        // 打开外部编辑器
  theme_list?: string                        // 列出可用主题
  sidebar_toggle?: string                     // 切换侧边栏
  scrollbar_toggle?: string                   // 切换会话滚动条
  username_toggle?: string                    // 切换用户名显示
  status_view?: string                       // 查看状态
  session_export?: string                     // 导出会话到编辑器
  session_new?: string                        // 创建新会话
  session_list?: string                       // 列出所有会话
  session_timeline?: string                     // 显示会话时间线
  session_share?: string                      // 共享当前会话
  session_unshare?: string                    // 取消共享当前会话
  session_interrupt?: string                   // 中断当前会话
  session_compact?: string                    // 压缩会话
  messages_page_up?: string                   // 消息向上翻页
  messages_page_down?: string                 // 消息向下翻页
  messages_line_up?: string                   // 消息向上滚动一行
  messages_line_down?: string                 // 消息向下滚动一行
  messages_half_page_up?: string              // 消息向上翻半页
  messages_half_page_down?: string            // 消息向下翻半页
  messages_first?: string                     // 导航到第一条消息
  messages_last?: string                      // 导航到最后一条消息
  messages_next?: string                      // 导航到下一条消息
  messages_previous?: string                   // 导航到上一条消息
  messages_last_user?: string                  // 导航到最后一条用户消息
  messages_copy?: string                      // 复制消息
  messages_undo?: string                      // 撤销消息
  messages_redo?: string                      // 重做消息
  messages_toggle_conceal?: string             // 切换代码块隐藏
  tool_details?: string                        // 切换工具详情显示
  model_list?: string                         // 列出可用模型
  model_cycle_recent?: string                 // 下一个最近使用的模型
  model_cycle_recent_reverse?: string          // 上一个最近使用的模型
  command_list?: string                       // 列出可用命令
  agent_list?: string                         // 列出 agents
  agent_cycle?: string                         // 下一个 agent
  agent_cycle_reverse?: string                  // 上一个 agent
  input_clear?: string                          // 清除输入字段
  input_forward_delete?: string                  // 向前删除
  input_paste?: string                         // 从剪贴板粘贴
  input_submit?: string                         // 提交输入
  input_newline?: string                        // 插入换行符
  history_previous?: string                      // 上一条历史记录
  history_next?: string                          // 下一条历史记录
  session_child_cycle?: string                 // 下一个子会话
  session_child_cycle_reverse?: string          // 上一个子会话
  terminal_suspend?: string                     // 挂起终端
  terminal_title_toggle?: string                 // 切换终端标题
}
```

## 会话类型

### Session

会话类型。

```typescript
type Session = {
  id: string                 // 会话 ID
  projectID: string          // 项目 ID
  directory: string           // 目录路径
  parentID?: string          // 父会话 ID
  summary?: {
    additions: number        // 新增行数
    deletions: number        // 删除行数
    files: number            // 影响文件数
    diffs?: Array<FileDiff>  // 差异列表
  }
  share?: {
    url: string           // 分享 URL
  }
  title: string               // 标题
  version: string            // 版本
  time: {
    created: number        // 创建时间戳
    updated: number        // 更新时间戳
    compacting?: number   // 压缩时间戳
  }
  revert?: {
    messageID: string     // 回退的消息 ID
    partID?: string       // 回退的部分 ID
    snapshot?: string       // 快照
    diff?: string           // 差异
  }
}
```

### Permission

权限类型。

```typescript
type Permission = {
  id: string                 // 权限 ID
  type: string                // 权限类型
  pattern?: string | Array<string>  // 权限模式
  sessionID: string           // 会话 ID
  messageID: string           // 消息 ID
  callID?: string             // 调用 ID（工具调用相关）
  title: string               // 权限标题
  metadata: {
    [key: string]: unknown  // 元数据
  }
  time: {
    created: number        // 创建时间戳
  }
}
```

## 文件类型

### FileNode

文件节点类型（文件系统遍历）。

```typescript
type FileNode = {
  name: string               // 名称
  path: string               // 路径
  absolute: string           // 绝对路径
  type: "file" | "directory"  // 类型
  ignored: boolean            // 是否被忽略
}
```

### FileContent

文件内容类型。

```typescript
type FileContent = {
  type: "text" | "binary"               // 内容类型
  content: string                           // 内容（文本或 base64）
  diff?: string                             // 差异（可选）
  patch?: {                                // 补丁信息（可选）
    oldFileName: string
    newFileName: string
    oldHeader?: string
    newHeader?: string
    hunks: Array<{
      oldStart: number
      oldLines: number
      newStart: number
      newLines: number
      lines: Array<string>
    }>
    index?: string
  }
  encoding?: "base64"                      // 编码（可选）
  mimeType?: string                         // MIME 类型（可选）
}
```

### File

文件状态类型（修改、添加、删除）。

```typescript
type File = {
  path: string               // 文件路径
  added: number              // 新增行数
  removed: number            // 删除行数
  status: "added" | "deleted" | "modified"  // 状态
}
```

## Model 和 Provider 类型

### Model

模型类型。

```typescript
type Model = {
  id: string                 // 模型 ID
  providerID: string          // Provider ID
  api: {
    id: string             // API ID
    url: string             // API URL
    npm: string             // NPM 包名
  }
  name: string               // 模型名称
  capabilities: {              // 能力
    temperature: boolean       // 是否支持温度参数
    reasoning: boolean         // 是否支持推理
    attachment: boolean        // 是否支持附件
    toolcall: boolean         // 是否支持工具调用
    input: {                 // 输入模态
      text: boolean
      audio: boolean
      image: boolean
      video: boolean
      pdf: boolean
    }
    output: {                // 输出模态
      text: boolean
      audio: boolean
      image: boolean
      video: boolean
      pdf: boolean
    }
  }
  cost: {                     // 成本
    input: number
    output: number
    cache: {
      read: number
      write: number
    }
    experimentalOver200K?: {
      input: number
      output: number
      cache: {
        read: number
        write: number
      }
    }
  }
  limit: {                    // 限制
    context: number
    output: number
  }
  status: "alpha" | "beta" | "deprecated" | "active"  // 状态
  options: {
    [key: string]: unknown
  }
  headers: {
    [key: string]: string
  }
}
```

### Provider

Provider 类型。

```typescript
type Provider = {
  id: string                 // Provider ID
  name: string               // Provider 名称
  source: "env" | "config" | "custom" | "api"  // 来源
  env: Array<string>         // 环境变量
  key?: string               // API key（如果有）
  options: {                  // 选项
    [key: string]: unknown
  }
  models: {                   // 模型
    [key: string]: Model
  }
}
```

### ProviderAuthMethod

Provider 认证方法类型。

```typescript
type ProviderAuthMethod = {
  type: "oauth" | "api"     // OAuth 或 API 认证
  label: string                  // 标签
}
```

### ProviderAuthAuthorization

OAuth 授权信息。

```typescript
type ProviderAuthAuthorization = {
  url: string                 // 授权 URL
  method: "auto" | "code"      // 方法（自动或代码）
  instructions: string          // 指令
}
```

## 工具类型

### ToolListItem

工具列表项类型。

```typescript
type ToolListItem = {
  id: string                 // 工具 ID
  description: string         // 描述
  parameters: unknown          // 参数（JSON schema）
}
```

## 其他类型

### Path

路径信息类型。

```typescript
type Path = {
  state: string               // 状态
  config: string              // 配置路径
  worktree: string            // 工作树根目录
  directory: string            // 当前目录
}
```

### VcsInfo

VCS 信息类型。

```typescript
type VcsInfo = {
  branch: string              // 当前分支
}
```

### Command

命令类型。

```typescript
type Command = {
  name: string               // 命令名称
  description?: string        // 描述
  agent?: string             // 使用的 agent
  model?: string             // 使用的模型
  template: string           // 模板
  subtask?: boolean          // 是否为子任务命令
}
```

### Auth

认证类型。

```typescript
type Auth = OAuth | ApiAuth | WellKnownAuth

type OAuth = {
  type: "oauth"
  refresh: string            // Refresh token
  access: string             // Access token
  expires: number            // 过期时间戳
  enterpriseUrl?: string       // Enterprise URL
}

type ApiAuth = {
  type: "api"
  key: string                // API key
}

type WellKnownAuth = {
  type: "wellknown"
  key: string                // Key
  token: string              // Token
}
```

### Agent

Agent 类型。

```typescript
type Agent = {
  name: string               // Agent 名称
  description?: string        // 描述
  mode: "subagent" | "primary" | "all"  // 模式
  builtIn: boolean           // 是否为内置 agent
  topP?: number              // Top p 参数
  temperature?: number         // 温度参数
  color?: string             // Hex 颜色代码
  permission: {               // 权限配置
    edit: "ask" | "allow" | "deny"
    bash: { [key: string]: "ask" | "allow" | "deny" }
    webfetch?: "ask" | "allow" | "deny"
    doom_loop?: "ask" | "allow" | "deny"
    external_directory?: "ask" | "allow" | "deny"
  }
  model?: {
    modelID: string
    providerID: string
  }
  prompt?: string             // Prompt 模板
  tools: {                     // 工具配置
    [key: string]: boolean
  }
  options: {
    [key: string]: unknown
  }
  maxSteps?: number           // 最大迭代次数
}
```

### McpStatus

MCP 服务器状态类型。

```typescript
type McpStatus =
  | McpStatusConnected                    // 已连接
  | McpStatusDisabled                    // 已禁用
  | McpStatusFailed                      // 已失败
  | McpStatusNeedsAuth                  // 需要认证
  | McpStatusNeedsClientRegistration     // 需要客户端注册

type McpStatusConnected = { status: "connected" }

type McpStatusDisabled = { status: "disabled" }

type McpStatusFailed = {
  status: "failed"
  error: string
}

type McpStatusNeedsAuth = { status: "needs_auth" }

type McpStatusNeedsClientRegistration = {
  status: "needs_client_registration"
  error: string
}
```

### LspStatus

LSP 服务器状态类型。

```typescript
type LspStatus = {
  id: string                 // LSP 服务器 ID
  name: string               // 名称
  root: string               // 根目录
  status: "connected" | "error"  // 状态
}
```

### FormatterStatus

Formatter 状态类型。

```typescript
type FormatterStatus = {
  name: string               // 名称
  extensions: Array<string>    // 支持的扩展名
  enabled: boolean            // 是否启用
}
```

### Pty

PTY (伪终端) 类型。

```typescript
type Pty = {
  id: string                 // PTY ID
  title: string               // 标题
  command: string             // 命令
  args: Array<string>          // 参数
  cwd: string                 // 工作目录
  status: "running" | "exited"  // 状态
  pid: number                 // 进程 ID
}
```

### Project

项目类型。

```typescript
type Project = {
  id: string                 // 项目 ID
  worktree: string             // Worktree 路径
  vcsDir?: string             // VCS 目录
  vcs?: "git"                 // VCS 类型（如 git）
  time: {                     // 时间信息
    created: number           // 创建时间戳
    initialized?: number      // 初始化时间戳
  }
}
```

## 请求/响应类型

各类 API 请求和响应类型遵循命名约定：
- `*Data` - 请求数据类型
- `*Responses` - 响应类型映射（状态码到响应）
- `*Response` - 联合响应类型（所有可能状态）
- `*Errors` - 错误类型映射

示例：
```typescript
type SessionCreateData = {
  body?: {
    parentID?: string
    title?: string
  }
  path?: never
  query?: {
    directory?: string
  }
  url: "/session"
}

type SessionCreateResponses = {
  200: Session
}

type SessionCreateResponse = Session
```

完整列表请参考源文件 `packages/sdk/js/src/gen/types.gen.ts`。
