# SDK 客户端 API 参考

## 导入

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk"
```

## 接口定义

### OpencodeClientConfig

客户端配置接口。

| 属性 | 类型 | 必需 | 描述 |
|-------|------|--------|------|
| baseUrl | string | 是 | OpenCode 服务器 URL |
| headers | Record<string, string> | 否 | 请求头 |
| directory | string | 否 | 项目目录路径，会自动添加到请求头 |
| fetch | FetchLike | 否 | 自定义 fetch 实现 |

## 创建客户端

### createOpencodeClient

创建 OpenCode 客户端实例。

```typescript
function createOpencodeClient(config?: OpencodeClientConfig): OpencodeClient
```

**示例:**

```typescript
const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
  directory: "/path/to/project",
  headers: {
    "x-custom-header": "value",
  },
})
```

## 客户端 API

### OpencodeClient 主类方法

#### postSessionIdPermissionsPermissionId

响应权限请求。

```typescript
postSessionIdPermissionsPermissionId<ThrowOnError extends boolean = false>(
  options: Options<PostSessionIdPermissionsPermissionIdData, ThrowOnError>
)
```

**参数:**
- `options.path.id` - Session ID
- `options.path.permissionID` - Permission ID
- `options.body.response` - "once" | "always" | "reject"

### 全局命名空间 (client.global)

#### event

获取全局事件流 (SSE)。

```typescript
global.event(options?: Options<GlobalEventData, ThrowOnError>)
```

**返回:** Server-Sent Events 流

### 项目命名空间 (client.project)

#### list

列出所有项目。

```typescript
project.list(options?: Options<ProjectListData, ThrowOnError>)
```

**参数:**
- `options.query.directory` - 项目目录路径

**返回:** `Array<Project>`

#### current

获取当前项目。

```typescript
project.current(options?: Options<ProjectCurrentData, ThrowOnError>)
```

**参数:**
- `options.query.directory` - 项目目录路径

**返回:** `Project`

### PTY 命名空间 (client.pty)

#### list

列出所有 PTY 会话。

```typescript
pty.list(options?: Options<PtyListData, ThrowOnError>)
```

#### create

创建新的 PTY 会话。

```typescript
pty.create(options?: Options<PtyCreateData, ThrowOnError>)
```

**参数:**
- `options.body.command` - 执行命令
- `options.body.args` - 命令参数
- `options.body.cwd` - 工作目录
- `options.body.title` - 会话标题
- `options.body.env` - 环境变量

**返回:** `Pty`

#### remove

删除 PTY 会话。

```typescript
pty.remove(options: Options<PtyRemoveData, ThrowOnError>)
```

**参数:**
- `options.path.id` - PTY ID

#### get

获取 PTY 会话信息。

```typescript
pty.get(options: Options<PtyGetData, ThrowOnError>)
```

**参数:**
- `options.path.id` - PTY ID

#### update

更新 PTY 会话。

```typescript
pty.update(options: Options<PtyUpdateData, ThrowOnError>)
```

**参数:**
- `options.path.id` - PTY ID
- `options.body.title` - 新标题
- `options.body.size` - 终端大小 {rows, cols}

#### connect

连接到 PTY 会话。

```typescript
pty.connect(options: Options<PtyConnectData, ThrowOnError>)
```

### 配置命名空间 (client.config)

#### get

获取配置信息。

```typescript
config.get(options?: Options<ConfigGetData, ThrowOnError>)
```

**返回:** `Config`

#### update

更新配置。

```typescript
config.update(options?: Options<ConfigUpdateData, ThrowOnError>)
```

**参数:**
- `options.body` - Config 对象

#### providers

列出所有 providers。

```typescript
config.providers(options?: Options<ConfigProvidersData, ThrowOnError>)
```

**返回:** `{providers: Array<Provider>, default: Record<string, string>}`

### 工具命名空间 (client.tool)

#### ids

列出所有工具 ID（包括内置和动态注册的）。

```typescript
tool.ids(options?: Options<ToolIdsData, ThrowOnError>)
```

**返回:** `Array<string>`

#### list

列出指定 provider/model 的工具及其 JSON schema 参数。

```typescript
tool.list(options: Options<ToolListData, ThrowOnError>)
```

**参数:**
- `options.query.provider` - Provider ID
- `options.query.model` - Model ID

**返回:** `Array<ToolListItem>`

### 实例命名空间 (client.instance)

#### dispose

释放当前实例。

```typescript
instance.dispose(options?: Options<InstanceDisposeData, ThrowOnError>)
```

### 路径命名空间 (client.path)

#### get

获取当前路径信息。

```typescript
path.get(options?: Options<PathGetData, ThrowOnError>)
```

**返回:** `Path`

### VCS 命名空间 (client.vcs)

#### get

获取当前实例的 VCS 信息。

```typescript
vcs.get(options?: Options<VcsGetData, ThrowOnError>)
```

**返回:** `VcsInfo`

### 会话命名空间 (client.session)

#### list

列出所有会话。

```typescript
session.list(options?: Options<SessionListData, ThrowOnError>)
```

**返回:** `Array<Session>`

#### create

创建新会话。

```typescript
session.create(options?: Options<SessionCreateData, ThrowOnError>)
```

**参数:**
- `options.body.parentID` - 父会话 ID
- `options.body.title` - 会话标题

**返回:** `Session`

#### status

获取会话状态。

```typescript
session.status(options?: Options<SessionStatusData, ThrowOnError>)
```

**返回:** `{[key: string]: SessionStatus}`

#### delete

删除会话及所有数据。

```typescript
session.delete(options: Options<SessionDeleteData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID

#### get

获取会话信息。

```typescript
session.get(options: Options<SessionGetData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID

**返回:** `Session`

#### update

更新会话属性。

```typescript
session.update(options: Options<SessionUpdateData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID
- `options.body.title` - 新标题

#### children

获取子会话列表。

```typescript
session.children(options: Options<SessionChildrenData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID

**返回:** `Array<Session>`

#### todo

获取会话的 todo 列表。

```typescript
session.todo(options: Options<SessionTodoData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID

**返回:** `Array<Todo>`

#### init

分析应用并创建 AGENTS.md 文件。

```typescript
session.init(options: Options<SessionInitData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID
- `options.body.modelID` - Model ID
- `options.body.providerID` - Provider ID
- `options.body.messageID` - Message ID

#### fork

在指定消息处 fork 会话。

```typescript
session.fork(options: Options<SessionForkData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID
- `options.body.messageID` - fork 消息 ID

**返回:** `Session`

#### abort

终止会话。

```typescript
session.abort(options: Options<SessionAbortData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID

#### unshare

取消共享会话。

```typescript
session.unshare(options: Options<SessionUnshareData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID

**返回:** `Session`

#### share

共享会话。

```typescript
session.share(options: Options<SessionShareData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID

**返回:** `Session`

#### diff

获取会话的 diff。

```typescript
session.diff(options: Options<SessionDiffData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID
- `options.query.messageID` - 可选，指定消息 ID

**返回:** `Array<FileDiff>`

#### summarize

总结会话。

```typescript
session.summarize(options: Options<SessionSummarizeData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID
- `options.body.providerID` - Provider ID
- `options.body.modelID` - Model ID

#### messages

列出会话的所有消息。

```typescript
session.messages(options: Options<SessionMessagesData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID
- `options.query.limit` - 可选，限制消息数量

**返回:** `Array<{info: Message, parts: Part[]}>`

####.prompt

创建并发送新消息到会话。

```typescript
session.prompt(options: Options<SessionPromptData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID
- `options.body.parts` - 消息部分数组
- `options.body.messageID` - 可选，消息 ID
- `options.body.agent` - 可选，Agent 名称
- `options.body.model` - 可选，{providerID, modelID}
- `options.body.system` - 可选，系统提示
- `options.body.tools` - 可选，工具启用/禁用
- `options.body.noReply` - 可选，是否等待回复

**返回:** `{info: AssistantMessage, parts: Part[]}`

#### message

获取单条消息。

```typescript
session.message(options: Options<SessionMessageData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID
- `options.path.messageID` - Message ID

**返回:** `{info: Message, parts: Part[]}`

#### promptAsync

异步提示（立即返回）。

```typescript
session.promptAsync(options: Options<SessionPromptAsyncData, ThrowOnError>)
```

**参数:** 同 `prompt`

**返回:** 204 No Content

#### command

发送命令到会话。

```typescript
session.command(options: Options<SessionCommandData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID
- `options.body.command` - 命令名称
- `options.body.arguments` - 命令参数
- `options.body.messageID` - 可选，消息 ID
- `options.body.agent` - 可选，Agent 名称
- `options.body.model` - 可选，模型字符串

**返回:** `{info: AssistantMessage, parts: Part[]}`

#### shell

运行 shell 命令。

```typescript
session.shell(options: Options<SessionShellData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID
- `options.body.command` - shell 命令
- `options.body.agent` - Agent 名称
- `options.body.model` - 可选，{providerID, modelID}

**返回:** `AssistantMessage`

#### revert

回退消息。

```typescript
session.revert(options: Options<SessionRevertData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID
- `options.body.messageID` - Message ID
- `options.body.partID` - 可选，Part ID

**返回:** `Session`

#### unrevert

恢复所有回退的消息。

```typescript
session.unrevert(options: Options<SessionUnrevertData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Session ID

**返回:** `Session`

### 命令命名空间 (client.command)

#### list

列出所有命令。

```typescript
command.list(options?: Options<CommandListData, ThrowOnError>)
```

**返回:** `Array<Command>`

### Provider 命名空间 (client.provider)

#### list

列出所有 providers。

```typescript
provider.list(options?: Options<ProviderListData, ThrowOnError>)
```

**返回:** Provider 列表包含 all、default、connected

#### auth

获取 provider 认证方法。

```typescript
provider.auth(options?: Options<ProviderAuthData, ThrowOnError>)
```

**返回:** `{[key: string]: Array<ProviderAuthMethod>}`

#### oauth

OAuth 子命名空间。

##### authorize

使用 OAuth 授权 provider。

```typescript
provider.oauth.authorize(options: Options<ProviderOauthAuthorizeData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Provider ID
- `options.body.method` - Auth method index

**返回:** `ProviderAuthAuthorization`

##### callback

处理 OAuth 回调。

```typescript
provider.oauth.callback(options: Options<ProviderOauthCallbackData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Provider ID
- `options.body.method` - Auth method index
- `options.body.code` - 可选，OAuth 授权码

**返回:** `boolean`

### 查找命名空间 (client.find)

#### text

在文件中查找文本。

```typescript
find.text(options: Options<FindTextData, ThrowOnError>)
```

**参数:**
- `options.query.pattern` - 查找模式
- `options.query.directory` - 可选，目录路径

**返回:** 匹配结果数组

#### files

查找文件。

```typescript
find.files(options: Options<FindFilesData, ThrowOnError>)
```

**参数:**
- `options.query.query` - 查询字符串
- `options.query.directory` - 可选，目录路径
- `options.query.dirs` - "true" | "false"，是否包含目录

**返回:** `Array<string>`

#### symbols

查找工作区符号。

```typescript
find.symbols(options: Options<FindSymbolsData, ThrowOnError>)
```

**参数:**
- `options.query.query` - 查询字符串
- `options.query.directory` - 可选，目录路径

**返回:** `Array<Symbol>`

### 文件命名空间 (client.file)

#### list

列出文件和目录。

```typescript
file.list(options: Options<FileListData, ThrowOnError>)
```

**参数:**
- `options.query.path` - 文件路径
- `options.query.directory` - 可选，目录路径

**返回:** `Array<FileNode>`

#### read

读取文件。

```typescript
file.read(options: Options<FileReadData, ThrowOnError>)
```

**参数:**
- `options.query.path` - 文件路径
- `options.query.directory` - 可选，目录路径

**返回:** `FileContent`

#### status

获取文件状态。

```typescript
file.status(options?: Options<FileStatusData, ThrowOnError>)
```

**参数:**
- `options.query.directory` - 可选，目录路径

**返回:** `Array<File>`

### 应用命名空间 (client.app)

#### log

写入日志到服务器日志。

```typescript
app.log(options?: Options<AppLogData, ThrowOnError>)
```

**参数:**
- `options.body.service` - 服务名称
- `options.body.level` - "debug" | "info" | "error" | "warn"
- `options.body.message` - 日志消息
- `options.body.extra` - 可选，额外元数据

**返回:** `boolean`

#### agents

列出所有 agents。

```typescript
app.agents(options?: Options<AppAgentsData, ThrowOnError>)
```

**返回:** `Array<Agent>`

### MCP 命名空间 (client.mcp)

#### status

获取 MCP 服务器状态。

```typescript
mcp.status(options?: Options<McpStatusData, ThrowOnError>)
```

**返回:** `{[key: string]: McpStatus}`

#### add

动态添加 MCP server。

```typescript
mcp.add(options?: Options<McpAddData, ThrowOnError>)
```

**参数:**
- `options.body.name` - MCP server 名称
- `options.body.config` - McpLocalConfig 或 McpRemoteConfig

#### connect

连接 MCP server。

```typescript
mcp.connect(options: Options<McpConnectData, ThrowOnError>)
```

**参数:**
- `options.path.name` - MCP server 名称

#### disconnect

断开 MCP server。

```typescript
mcp.disconnect(options: Options<McpDisconnectData, ThrowOnError>)
```

**参数:**
- `options.path.name` - MCP server 名称

#### auth

MCP 认证子命名空间。

##### remove

移除 MCP server 的 OAuth 凭证。

```typescript
mcp.auth.remove(options: Options<McpAuthRemoveData, ThrowOnError>)
```

**参数:**
- `options.path.name` - MCP server 名称

##### start

开始 MCP server 的 OAuth 认证流程。

```typescript
mcp.auth.start(options: Options<McpAuthStartData, ThrowOnError>)
```

**参数:**
- `options.path.name` - MCP server 名称

**返回:** `{authorizationUrl: string}`

##### callback

完成 OAuth 认证。

```typescript
mcp.auth.callback(options: Options<McpAuthCallbackData, ThrowOnError>)
```

**参数:**
- `options.path.name` - MCP server 名称
- `options.body.code` - OAuth 授权码

**返回:** `McpStatus`

##### authenticate

开始 OAuth 流程并等待回调（打开浏览器）。

```typescript
mcp.auth.authenticate(options: Options<McpAuthAuthenticateData, ThrowOnError>)
```

**参数:**
- `options.path.name` - MCP server 名称

**返回:** `McpStatus`

### LSP 命名空间 (client.lsp)

#### status

获取 LSP server 状态。

```typescript
lsp.status(options?: Options<LspStatusData, ThrowOnError>)
```

**返回:** `Array<LspStatus>`

### Formatter 命名空间 (client.formatter)

#### status

获取 formatter 状态。

```typescript
formatter.status(options?: Options<FormatterStatusData, ThrowOnError>)
```

**返回:** `Array<FormatterStatus>`

### TUI 命名空间 (client.tui)

#### appendPrompt

向 TUI 追加提示。

```typescript
tui.appendPrompt(options?: Options<TuiAppendPromptData, ThrowOnError>)
```

**参数:**
- `options.body.text` - 要追加的文本

#### openHelp

打开帮助对话框。

```typescript
tui.openHelp(options?: Options<TuiOpenHelpData, ThrowOnError>)
```

#### openSessions

打开会话对话框。

```typescript
tui.openSessions(options?: Options<TuiOpenSessionsData, ThrowOnError>)
```

#### openThemes

打开主题对话框。

```typescript
tui.openThemes(options?: Options<TuiOpenThemesData, ThrowOnError>)
```

#### openModels

打开模型对话框。

```typescript
tui.openModels(options?: Options<TuiOpenModelsData, ThrowOnError>)
```

#### submitPrompt

提交提示。

```typescript
tui.submitPrompt(options?: Options<TuiSubmitPromptData, ThrowOnError>)
```

#### clearPrompt

清除提示。

```typescript
tui.clearPrompt(options?: Options<TuiClearPromptData, ThrowOnError>)
```

#### executeCommand

执行 TUI 命令。

```typescript
tui.executeCommand(options?: Options<TuiExecuteCommandData, ThrowOnError>)
```

**参数:**
- `options.body.command` - 命令名称

#### showToast

显示 toast 通知。

```typescript
tui.showToast(options?: Options<TuiShowToastData, ThrowOnError>)
```

**参数:**
- `options.body.message` - 消息内容
- `options.body.title` - 可选，标题
- `options.body.variant` - "info" | "success" | "warning" | "error"
- `options.body.duration` - 可选，持续时间（毫秒）

#### publish

发布 TUI 事件。

```typescript
tui.publish(options?: Options<TuiPublishData, ThrowOnError>)
```

**参数:**
- `options.body` - EventTuiPromptAppend | EventTuiCommandExecute | EventTuiToastShow

#### control

TUI Control 子命名空间。

##### next

从队列获取下一个 TUI 请求。

```typescript
tui.control.next(options?: Options<TuiControlNextData, ThrowOnError>)
```

**返回:** `{path: string, body: unknown}`

##### response

提交响应到 TUI 请求队列。

```typescript
tui.control.response(options?: Options<TuiControlResponseData, ThrowOnError>)
```

**参数:**
- `options.body` - 响应数据

### 认证命名空间 (client.auth)

#### set

设置认证凭证。

```typescript
auth.set(options: Options<AuthSetData, ThrowOnError>)
```

**参数:**
- `options.path.id` - Auth ID
- `options.body` - Auth 对象 (OAuth | ApiAuth | WellKnownAuth)

**返回:** `boolean`

### 事件命名空间 (client.event)

#### subscribe

订阅事件流。

```typescript
event.subscribe(options?: Options<EventSubscribeData, ThrowOnError>)
```

**返回:** Server-Sent Events 流，事件类型包括 Event

## 类型定义

详见 [types.md](./types.md) 文档。
