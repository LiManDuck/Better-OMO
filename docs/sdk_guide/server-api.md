# SDK 服务器 API 参考

## 标准 SDK 服务器 (packages/sdk/js)

### 导入

```typescript
import { createOpencodeServer, createOpencodeTui } from "@opencode-ai/sdk"
```

### 类型定义

#### ServerOptions

创建 OpenCode 服务器的选项。

```typescript
type ServerOptions = {
  hostname?: string    // 默认: "127.0.0.1"
  port?: number         // 默认: 4096
  signal?: AbortSignal  // 可选，省略信号
  timeout?: number       // 默认: 5000ms
  config?: Config        // OpenCode 配置
}
```

#### TuiOptions

启动 TUI 的选项。

```typescript
type TuiOptions = {
  project?: string       // 项目路径
  model?: string         // 模型字符串 (provider/model)
  session?: string       // Session ID
  agent?: string         // Agent 名称
  signal?: AbortSignal    // 可选，省略信号
  config?: Config        // OpenCode 配置
}
```

### API 方法

#### createOpencodeServer

创建并启动 OpenCode HTTP 服务器。

```typescript
async function createOpencodeServer(options?: ServerOptions): Promise<{
  url: string      // 服务器 URL
  close(): void     // 关闭服务器的函数
}>
```

**行为:**
1. 启动 `opencode serve` 进程
2. 等待在 stdout 中看到 "opencode server listening" 消息
3. 解析服务器 URL（http 或 https）
4. 如果超时或进程意外退出则抛出错误
5. 配置通过环境变量 `OPENCODE_CONFIG_CONTENT` 传递

**示例:**

```typescript
// 基本使用
const server = await createOpencodeServer({
  port: 8080,
  config: {
    model: "anthropic/claude-3-5-sonnet-20241022",
    logLevel: "INFO"
  }
})

console.log(`Server running at ${server.url}`)

// 稍后关闭服务器
server.close()
```

**示例：使用 AbortSignal:**

```typescript
const controller = new AbortController()

const server = await createOpencodeServer({
  signal: controller.signal,
  port: 8080
})

// 稍后中止服务器启动
setTimeout(() => {
  controller.abort()
}, 5000)
```

#### createOpencodeTui

启动 OpenCode TUI (Terminal User Interface)。

```typescript
function createOpencodeTui(options?: TuiOptions): {
  close(): void   // 关闭 TUI 的函数
}
```

**行为:**
1. 启动 `opencode` 进程，不使用 serve 模式
2. 根据选项设置命令行参数（--project, --model, --session, --agent）
3. stdio 设置为 "inherit"，直接连接到当前进程的 stdio
4. 配置通过环境变量 `OPENCODE_CONFIG_CONTENT` 传递

**示例:**

```typescript
// 启动 TUI
const tui = createOpencodeTui({
  project: "/path/to/project",
  model: "anthropic/claude-3-5-sonnet-20241022",
  agent: "build"
})

// 用户在 TUI 中交互...
// ...交互完成后
tui.close()
```

**使用示例：**

```typescript
import { createOpencodeClient, createOpencodeServer } from "@opencode-ai/sdk"

// 1. 创建并启动服务器
const server = await createOpencodeServer({
  port: 8080,
  config: {
    model: "anthropic/claude-3-5-sonnet-20241022",
  }
})

console.log(`Server running at ${server.url}`)

// 2. 创建客户端
const client = createOpencodeClient({
  baseUrl: server.url
})

// 3. 使用客户端 API
const sessions = await client.session.list()
console.log('Sessions:', sessions)

// 4. 创建新会话
const session = await client.session.create({
  body: {
    title: "My First Session"
  }
})
console.log('Created session:', session)

// 5. 关闭服务器
server.close()
```

## AgentKernel SDK 服务器 (packages/sdk/js-agentkernel)

AgentKernel SDK 提供了一个完整的服务器管理方案，专门用于 CodeAgent.

### 导入

```typescript
import { createAgentServer } from "@opencode-ai/sdk"
```

### 类型定义

#### CreateAgentServerOptions

创建 Agent 服务器的选项。

```typescript
interface CreateAgentServerOptions {
  webserverPath: string           // webserver 可执行文件路径 (必需)
  type: string                     // 服务器类型标识符 (必需)
  env?: string                     // 环境类型: "clouddragon" | "hc" (默认: "clouddragon")
  signal?: AbortSignal              // 可选，省略信号
  timeout?: number                  // 等待启动超时 (默认: 5000ms)
  maxRetries?: number              // 最大重启重试次数 (默认: 5)
  healthCheckPath?: string          // 健康检查路径 (默认: "/global/health")
  healthCheckTimeout?: number       // 健康检查超时 (默认: 3000ms)
  portRangeStart?: number          // 端口范围起始 (默认: 10000)
  portRangeEnd?: number            // 端口范围结束 (默认: 65535)
  scenario?: string                 // 场景标识符 (可选)
  ideVersion?: string               // IDE 版本 (可选，用于配置文件命名)
  pluginVersion?: string            // 插件版本 (可选，用于配置文件命名)
}
```

#### AgentServer

Agent server 实例。

```typescript
interface AgentServer {
  url: string      // 服务器 URL (http://localhost:port)
  port: number     // 监听端口号
  pid: number      // 服务器进程 PID
  close(): void     // 关闭服务器并清理资源
}
```

#### ServerEvent

服务器事件枚举。

```typescript
enum ServerEvent {
  RESTART,  // 服务器重启
  KILL,      // 服务器被杀死（包括被关闭）
}
```

### API 方法

#### createAgentServer

创建并启动 Agent 服务器。

```typescript
async function createAgentServer(options: CreateAgentServerOptions): Promise<AgentServer>
```

**行为:**

1. **参数验证**: 验证 webserverPath 存在且 type 为有效字符串

2. **文件锁获取**:
   - 根据 type、env、ideVersion 和 pluginVersion 生成锁文件路径
   - 尝试获取文件锁（独占模式打开文件）
   - 如果锁文件存在且超时（默认 30 秒），则先删除
   - 锁超时时间为 30 秒，每秒重试一次

3. **配置文件处理**:
   - 读取配置文件（.properties 格式）
   - 如果配置文件存在且 PID 存活且端口对应，则复用现有服务器
   - 否则创建新服务器

4. **进程启动**:
   - **Windows**: 使用 PowerShell `Start-Process` 命令隐藏窗口启动 webserver.exe
   - **Unix-like**: 直接使用 `spawn` 启动进程
   - 参数包括: `--port=PORT serve --enable-idle-shutdown --scenario=SCENARIO`

5. **PID 获取** (Windows):
   - 由于使用 PowerShell 启动，无法直接获取 PID
   - 使用 `netstat` 命令通过端口查找对应 PID
   - 最多尝试 5 次，每次等待 3 秒

6. **健康检查**:
   - 初始延迟 3 秒
   - 每隔 5 秒检查一次
   - 最多尝试 10 次
   - 验证响应包含 `{healthy: true}`

7. **进程监控**:
   - 每 10 秒检查一次进程是否存活
   - 如果进程意外退出，自动重启服务器
   - 重启最多尝试 maxRetries 次
   - 重启使用指数退避策略（最多 30 秒）

8. **配置文件写入**:
   - 保存 port、pid、type 到配置文件
   - 配置文件格式: .properties

9. **信号处理**:
   - 如果提供了 `signal`，中止时自动调用 `close()`

10. **资源清理**:
    - `close()` 方法会清除进程监控定时器
    - 终止服务器进程
    - 删除锁文件

**配置文件位置:**

- clouddragon env: `~/.codemate/webserver_{type}_{ideVersion}_{pluginVersion}_{kernelVersion}.properties`
- hc env: `~/.codeartsdoer/webserver_{type}_{ideVersion}_{pluginVersion}_{kernelVersion}.properties`

**示例:**

```typescript
import { createAgentServer } from "@opencode-ai/sdk"

// 基本使用
const server = await createAgentServer({
  webserverPath: "/path/to/webserver/bun.exe",
  type: "codeagent",
  scenario: "development",
  portRangeStart: 20000,
  portRangeEnd: 30000
})

console.log(`Server running at ${server.url}, PID: ${server.pid}`)

// 稍后关闭服务器
server.close()
```

**示例：完整配置**

```typescript
const server = await createAgentServer({
  webserverPath: "/usr/local/webserver/bun.exe",
  type: "cloudstudio",
  env: "clouddragon",
  scenario: "production",
  ideVersion: "1.0.0",
  pluginVersion: "2.0.0",
  timeout: 10000,
  maxRetries: 3,
  healthCheckPath: "/global/health",
  healthCheckTimeout: 5000,
  signal: abortController.signal
})

console.log(`Server: ${server.url}`)
```

**示例：事件监听**

```typescript
import { registerEventCb, ServerEvent } from "@opencode-ai/sdk"

// 注册 KILL 事件监听器
const killHandler = (server: AgentServer) => {
  console.log(`Server killed: ${server.url}, PID: ${server.pid}`)
  // 执行清理或通知逻辑
}

registerEventCb(ServerEvent.KILL, killHandler)

// 注册 RESTART 事件监听器
const restartHandler = (server: AgentServer) => {
  console.log(`Server restarted: ${server.url}, PID: ${server.pid}`)
  // 执行恢复或通知逻辑
}

registerEventCb(ServerEvent.RESTART, restartHandler)

// 创建服务器
const server = await createAgentServer({
  webserverPath: "/path/to/webserver/bun.exe",
  type: "codeagent"
})

// ... 服务器运行工作 ...
// killHandler 会在 server.close() 时被调用
// restartHandler 会在服务器自动重启时被调用
```

#### registerEventCb

注册服务器事件回调函数。

```typescript
function registerEventCb(
  type: ServerEvent,
  fn: (args: any) => void
): Function  // 返回取消注册函数
```

**参数:**
- `type`: 事件类型 (ServerEvent.RESTART 或 ServerEvent.KILL)
- `fn`: 回调函数，参数为事件相关的数据

**返回:** 取消注册的函数

示例：

```typescript
const unregister = registerEventCb(ServerEvent.RESTART, (server) => {
  console.log(`Server restarted on port ${server.port}`)
})

// 稍后取消注册
unregister()
```

#### unregisterEventCb

取消注册服务器事件回调函数。

```typescript
function unregisterEventCb(
  type: ServerEvent,
  fn: Function
): void
```

#### kernelVersion

获取 kernel 版本号。

```typescript
function kernelVersion(): string
```

## 标准服务器 vs AgentKernel 服务器对比

| 功能 | 标准 SDK Server | AgentKernel Server |
|------|-----------------|-------------------|
| 创建方式 | 使用 `opencode` CLI | 使用 webserver 可执行文件 |
| 端口管理 | 固定端口 | 动态端口分配 |
| 配置管理 | 通过环境变量 | 通过配置文件 + 锁机制 |
| 进程监控 | 基础调用 | 完整监控 + 自动重启 |
| 事件系统 | 无 | 支持 RESTART / KILL 事件 |
| 健康检查 | 等待启动完成 | 多次健康检查 + 超时 |
| 进程复用 | 无 | 检查并复用现有进程 |
| 跨实例协调 | 无 | 文件锁防止冲突 |
| 场景支持 | 无 | 支持 scenario 参数 |
| IDE 集成 | 基础 | 针对 IDE 插件优化 |
