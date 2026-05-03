# Better-OMO 开发指南

## 项目概览

Better-OMO 是一个基于 OpenCode 的增强型插件，源自 oh-my-opencode，经过简化和重构。

### 核心特性

- **多 Agent 系统**: 6个专门的 agent，各司其职
- **TMUX 集成**: 自动管理子 agent 的 TMUX 会话
- **并发控制**: 三级粒度的并发限制
- **事件处理**: 完整的会话生命周期管理
- **System Reminder**: 智能提醒系统

## 开发环境设置

### 前置要求

- Bun 运行时
- Node.js 20+ 或 22+
- TypeScript 5.0+

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/LiManDuck/Better-OMO.git
cd Better-OMO

# 安装依赖
npm install

# 构建
npm run build
```

## 项目结构详解

```
Better-OMO/
├── src/
│   ├── agent/              # Agent 定义
│   │   ├── explore/        # 只读探索 agent
│   │   ├── general/         # 通用 agent
│   │   ├── look-at/         # 多模态 agent
│   │   ├── claude-code/     # CC 兼容 agent
│   │   ├── clawcoder/       # 自定义 coder
│   │   ├── autose/          # 自动化 agent
│   │   ├── schema.ts        # Agent 接口定义
│   │   └── index.ts         # Agent 导出
│   ├── config/             # 配置系统
│   │   └── schema.ts        # 配置 Schema
│   ├── constants/          # 常量定义
│   │   ├── index.ts         # 主常量
│   │   └── event.ts         # 事件常量
│   ├── handlers/           # 事件处理器
│   │   └── session-events.ts
│   ├── hooks/              # Hook 实现
│   │   ├── anthropic-context-window-limit-recovery/
│   │   ├── auto-slash-command/
│   │   └── index.ts
│   ├── system-reminder/    # Reminder 系统
│   │   ├── manager.ts
│   │   ├── reminders/
│   │   │   └── bash.ts
│   │   └── index.ts
│   ├── tool/              # 工具实现
│   │   ├── delegate-task/
│   │   └── slashcommand/
│   ├── utils/             # 工具函数
│   │   ├── tmux/
│   │   └── concurrency.ts
│   ├── types/             # 类型定义
│   ├── index.ts           # 主入口
│   └── plugin-config.ts   # 配置加载
├── commands/              # Slash 命令定义
│   ├── role.md
│   └── btw.md
├── dist/                  # 编译输出
│   └── schema.json        # 配置 Schema
└── docs/                  # 文档
```

## 核心组件说明

### 1. Agent 系统

每个 agent 都有独立的目录和配置：

```typescript
// src/agent/explore/index.ts
export function createExploreAgent(model: string): AgentConfig {
  return {
    id: "explore",
    name: "Explorer",
    description: "Read-only exploration agent",
    model,
    prompt: AGENT_PROMPTS.EXPLORE,
    tools: {
      // 只读工具
      read: true,
      bash: { read: true },
    },
  }
}
```

### 2. TMUX 系统

自动管理子 agent 的 TMUX 会话：

```typescript
const tmuxManager = new TmuxSessionManager(ctx, tmuxConfig)

// 会话创建时自动启动 TMUX pane
await tmuxManager.onSessionCreated({
  sessionID: "session-123",
  parentID: "parent-456",
  title: "Background Task",
})
```

### 3. 并发控制

三级粒度并发限制：

```typescript
const manager = new ConcurrencyManager(config)

// Model 级别优先级最高
manager.acquire("claude-3-5-sonnet")

// Provider 级别次之
manager.acquire("anthropic/claude-3-5-sonnet")

// Default 级别兜底
manager.getConcurrencyLimit("unknown-model")
```

### 4. System Reminder

智能提醒注册系统：

```typescript
manager.register("bash-failure", "Remind bash version on failure", (ctx) => {
  if (ctx.tool === "bash" && ctx.toolOutput?.error) {
    return { shouldInject: true, content: "Bash command failed. Check shell version." }
  }
  return { shouldInject: false, content: "" }
})
```

## 开发命令

```bash
# 构建
npm run build

# 开发模式（监听文件变化）
npm run dev

# 类型检查
npm run typecheck

# 清理构建产物
npm run clean

# 重新构建
npm run rebuild
```

## 配置说明

### 配置文件位置

`~/.config/opencode/bt-omo.json`

### 配置示例

```json
{
  "$schema": "./dist/schema.json",
  "provider": "anthropic",
  "default_model": "claude-3-5-sonnet-20241022",
  "tmux": {
    "enabled": true,
    "layout": "main-vertical",
    "main_pane_size": 60
  },
  "background_task": {
    "defaultConcurrency": 5,
    "providerConcurrency": {
      "anthropic": 3
    },
    "modelConcurrency": {
      "claude-3-5-sonnet-20241022": 2
    }
  }
}
```

## 调试技巧

### 1. 查看 Agent 日志

```typescript
console.log("[Better-OMO] Agent created:", agent.name)
```

### 2. 测试 TMUX 连接

```bash
# 检查是否在 TMUX 中
echo $TMUX

# 手动测试 TMUX 命令
tmux list-sessions
```

### 3. 验证配置

```bash
# 检查配置文件
cat ~/.config/opencode/bt-omo.json

# 验证 JSON Schema
cat dist/schema.json
```

## 常见问题

### Q: TMUX pane 不创建？

A: 检查以下几点：
1. 是否在 TMUX 会话中（`echo $TMUX`）
2. `tmux.enabled` 是否为 `true`
3. OpenCode server 是否运行

### Q: 编译失败？

A: 运行清理后重新构建：
```bash
npm run clean
npm run build
```

### Q: Agent 不显示？

A: 检查 agent 是否正确导出：
```typescript
// src/agent/index.ts
export { createExploreAgent } from "./explore"
```

## 贡献指南

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'cc : Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### Commit 规范

- 使用 `cc :` 前缀
- 简洁明了描述更改
- 示例：`cc : Implement TMUX session auto-recovery`

## 性能优化建议

1. **减少不必要的 session 创建**
   - 使用 delegate_task 的 fork 参数继承上下文
   - 避免重复创建类似的子 agent

2. **优化并发设置**
   - 根据机器性能调整并发数
   - 模型级别限制优先级最高

3. **合理使用 TMUX**
   - 只在需要时启用 TMUX
   - 及时清理完成的会话

## 安全注意事项

1. 不要在配置文件中存储敏感信息
2. 使用环境变量管理 API 密钥
3. 注意 Bash 命令的执行权限

## 更新日志

### v1.0.0 (2026-05-03)
- ✨ 初始版本发布
- ✨ 实现所有核心功能
- 🎨 完成代码重构
- 📝 完善文档系统

## 许可证

MIT License

## 联系方式

- GitHub: https://github.com/LiManDuck/Better-OMO
- Issues: https://github.com/LiManDuck/Better-OMO/issues
