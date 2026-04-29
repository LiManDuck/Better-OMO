# event Hook 详解

## Hook 定义

```typescript
"event"?: (
  input: { event: Event },
  output: void
) => Promise<void>
```

**触发时机**: 任何 Bus 事件发布时

**文件位置**: `packages/plugin/src/index.ts`

---

## Input 详解

```typescript
input: {
  event: Event  // 事件对象，包含 type 和 properties
}
```

**Event 类型**:
```typescript
interface Event {
  type: string      // 事件类型
  properties: any   // 事件属性
}
```

---

## 使用场景

### 1. 监听所有事件
```typescript
"event": async ({ event }) => {
  console.log(`Event: ${event.type}`, event.properties)
}
```

### 2. 监听特定事件
```typescript
"event": async ({ event }) => {
  if (event.type === "file.edited") {
    console.log("File edited:", event.properties.file)
  }
}
```

---

## Event 类型汇总

### Session 相关事件
- `session.created` - 新建会话时
- `session.updated` - 会话信息变更时
- `session.deleted` - 删除会话时
- `session.diff` - 代码差异变化时
- `session.error` - 会话发生错误时
- `session.idle` - 会话空闲时
- `session.status` - 会话状态变化时
- `session.compacted` - 会话压缩完成时
- `session.compacted_before` - 会话压缩前
- `session.compacted_after` - 会话压缩后

### Message 相关事件
- `message.updated` - 消息更新时
- `message.removed` - 消息删除时
- `message.queue.updated` - 排队状态更新时
- `message.part.updated` - 消息部分更新时
- `message.part.delta` - 消息部分增量更新时
- `message.part.removed` - 消息部分删除时

### File 相关事件
- `file.edited` - 文件编辑完成时
- `file.watcher.updated` - 文件变化时

### Permission 相关事件
- `permission.asked` - 用户执行敏感操作时
- `permission.replied` - 用户响应权限请求时

### 其他事件
- `pty.created` / `pty.updated` / `pty.exited` / `pty.deleted`
- `command.executed` / `command.reload` / `command.added` / `command.removed`
- `todo.updated`
- `question.asked` / `question.replied` / `question.rejected`

---

## 注意事项

- Event 是只读的，不能修改
- 可以监听任意数量的不同事件类型
- 性能考虑：避免在 Hook 中执行耗时操作
