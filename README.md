# Better-OMO

一个基于 OpenCode 的增强型插件，源自 oh-my-opencode，经过简化和重构以提高可维护性。

## 特性

### 🤖 多 Agent 系统
- **explore**: 只读探索 agent，用于代码库分析
- **general**: 通用 agent，具备所有能力
- **look-at**: 多模态 agent，支持图像分析
- **claude-code**: Claude Code 兼容 agent
- **clawcoder**: 自定义 coder agent
- **autose**: 自动化 agent

### 🛠️ 内置工具
- **delegate_task**: 任务委托工具，支持 fork 参数继承上下文
- **slashcommand**: 斜杠命令系统

### 🔔 System Reminder 系统
- Bash 工具失败提醒
- 文件操作安全提醒
- 危险命令警告

### 🖥️ TMUX 集成
- 自动创建子 agent 的 TMUX pane
- 会话生命周期管理
- 支持多种布局模式

### ⚡ 并发控制
- 三级粒度并发限制（model > provider > default）
- 队列管理和等待机制

### 🔄 事件处理
- Session 创建/删除/错误处理
- 自动恢复可恢复的错误
- 状态追踪和管理

## 安装

```bash
# 克隆仓库
git clone https://github.com/LiManDuck/Better-OMO.git
cd Better-OMO

# 安装依赖
npm install

# 构建
npm run build
```

## 配置

配置文件位于 `~/.config/opencode/bt-omo.json`

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
    "defaultConcurrency": 5
  }
}
```

## Slash 命令

### /role - 切换角色
切换到特定的 agent 角色

### /btw - 工作区管理
Better-OMO 工作区工具

## 开发

```bash
# 构建
npm run build

# 开发模式
npm run dev
```

## 架构特点

- 类型集中管理，避免霰弹式修改
- 常量集中定义，防止字符串散落
- 独立的 Reminder 系统，易于扩展
- 模块化设计，职责清晰

## 许可证

MIT

## 致谢

基于 oh-my-opencode 开发，感谢原作者的工作。
