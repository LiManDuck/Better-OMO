# Better-OMO 开发计划

## 当前状态：核心功能开发中 (40%完成)

## 第一阶段：项目基础搭建 ✅

### 1.1 项目初始化
- [x] 创建基础目录结构
  - [x] config/
  - [x] agent/
  - [x] tool/
  - [x] system-reminder/
  - [x] utils/
  - [x] constants/
  - [x] types/
  - [x] hooks/
- [x] 初始化 package.json
- [x] 配置 TypeScript (tsconfig.json)
- [x] 配置构建脚本

### 1.2 类型系统重构
- [x] 创建 types/opencode-plugin-type.ts
  - [x] 从 @opencode-ai/plugin 导出所有必要类型
  - [x] 定义统一的类型导出接口
- [x] 创建 constants/index.ts
  - [x] 整合所有 hook 名称常量
  - [x] 整合事件类型常量
  - [x] 整合消息类型常量

### 1.3 配置系统
- [x] 创建 config/schema.ts
  - [x] 定义 BtOmoConfig 接口
  - [x] 支持用户自定义配置字段
- [x] 实现配置加载逻辑
- [x] 支持从 ~/.config/opencode/bt-omo.json 读取配置

## 第二阶段：核心功能迁移 ✅

### 2.1 Agent 系统 ✅
- [x] 创建 agent/schema.ts
  - [x] 定义 agent 接口规范
- [x] 迁移 explore agent (只读权限)
- [x] 迁移 general agent (全能力)
- [x] 迁移 look-at agent (多模态)
- [x] 新增 claude-code agent
  - [x] 实现 CC 兼容的 system reminder
  - [ ] 实现 team 机制
  - [ ] 实现 memory 机制
- [x] 新增 clawcoder agent
- [x] 新增 autose agent
- [x] 主 agent 提示词设置 (临时: "you are bt-omo, a good code agent")
- [x] 实现 discoverAgents 函数

### 2.2 Tool 系统 ✅
- [x] 迁移 slashcommand 工具
- [x] 迁移 delegate_task 工具
  - [x] 新增 fork 参数 (默认 true)
  - [x] 保留 category 机制
  - [x] 修复为符合SDK API规范（session.create只接受body/query）
- [x] 移除 call_omo_agent
- [x] 移除 websearch 等 web 类工具
- [x] 使用 tool.schema 而非直接使用 zod

### 2.3 Hook 系统 ✅
- [x] 迁移并精简 hooks
  - [x] 保留 anthropic-context-window-limit-recovery
  - [x] 保留 autoslashcommand
  - [x] 移除 sisyphus 等多 agent 编排相关 hooks
  - [x] 移除 Claude Code 检测 hook
  - [x] 移除模型特定逻辑 (gemini/claude)

### 2.4 System Reminder 系统 ✅
- [x] 创建独立的 system-reminder 模块
  - [x] 设计统一触发机制
  - [x] 实现 reminder 注册系统
  - [x] bash 工具提醒
    - [x] 失败/空返回时提醒 bash 版本
    - [x] cp/mkdir 等命令操作提醒
    - [x] 危险命令确认
- [x] 在消息入队前注入
- [x] 在工具执行后注入

### 2.5 主入口整合 ✅
- [x] 更新 src/index.ts
  - [x] 整合所有 hooks
  - [x] 整合所有 agents
  - [x] 整合所有 tools
- [x] 项目编译成功

## 第三阶段：高级功能

### 3.1 并发控制
- [ ] 迁移 ConcurrencyManager
  - [ ] 三级粒度并发控制
- [ ] 迁移任务难度路由机制

### 3.2 Background Manager
- [ ] 迁移 background manager 系统

### 3.3 TMUX 系统 ✅
- [x] 创建 utils/tmux-manager.ts
  - [x] 合并 src/features/tmux-subagent/manager.ts
  - [x] 合并 shared/tmux 内容
- [x] 会话创建时启动 tmux
- [x] 会话删除时清理资源
- [x] 集成到主入口事件处理

### 3.4 事件处理
- [ ] session.error 事件处理
  - [ ] 可恢复类型的会话恢复
- [ ] message.updated 事件处理
  - [ ] 更新 session agent 名称
- [ ] session.deleted 事件处理
  - [ ] 清空资源
- [ ] session.created 事件处理
  - [ ] 启动 tmux
  - [ ] 记录父会话 ID

### 3.5 Slash 命令
- [ ] 实现 /role 命令
- [ ] 实现 /btw 命令

### 3.6 Skill 和 MCP
- [ ] 迁移 skill 系统保持不变
- [ ] 迁移 MCP 功能保持不变
- [ ] 创建 utils/skill-loader.ts
- [ ] 创建 utils/command-loader.ts

## 第四阶段：集成和测试

### 4.1 主入口
- [ ] 完善 plugin-config.ts
- [ ] 添加更多配置选项

### 4.2 构建和打包
- [x] 配置构建脚本
- [ ] 生成 schema.json
- [ ] 测试构建产物

### 4.3 测试
- [ ] 单元测试
- [ ] 集成测试
- [ ] 功能验证

## 第五阶段：文档和收尾

### 5.1 文档
- [ ] 编写 README.md
- [ ] 编写配置说明文档
- [ ] 编写开发文档

### 5.2 最后检查
- [ ] 代码审查
- [ ] 性能优化
- [ ] 安全检查

## 进度追踪

- 开始时间: 2026-05-03
- 当前阶段: 第三阶段 - 高级功能
- 完成百分比: 40%

## 已完成
- ✅ 项目基础搭建
- ✅ Agent 系统 (6个agents: explore, general, look-at, claude-code, clawcoder, autose)
- ✅ Tool 系统 (delegate_task, slashcommand)
- ✅ Hook 系统 (context recovery, auto slash command)
- ✅ System Reminder 系统
- ✅ TMUX 系统 (session manager, event handling)
- ✅ 项目编译通过

## 下一步任务
1. 并发控制迁移
2. Background Manager 迁移
3. 事件处理完善
4. Slash命令实现

## 注意事项

1. 所有 commit 格式: "cc : <实际信息>"
2. 定期 git push
3. 常量必须集中在 constants/
4. 类型必须从 types/opencode-plugin-type.ts 导入
5. 保持代码可扩展性
6. 优先完成核心逻辑
7. session.create API 只接受 body (parentID, title) 和 query (directory)
8. 使用 tool.schema 而非 zod 直接调用