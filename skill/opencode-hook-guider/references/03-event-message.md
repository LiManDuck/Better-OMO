# Message 相关 Event 详解

## Event 汇总

| 事件名 | 触发时机 | properties |
|--------|----------|------------|
| `message.updated` | 消息更新时 | `{info: Message.Info}` |
| `message.removed` | 消息删除时 | `{sessionID, messageID}` |
| `message.queue.updated` | 排队状态更新时 | `{sessionID, runningTaskSize, waitingQueueIndex}` |
| `message.part.updated` | 消息部分更新时 | `{part: MessagePart}` |
| `message.part.delta` | 消息部分增量更新时 | `{part: MessagePart}` |
| `message.part.removed` | 消息部分删除时 | `{part: MessagePart}` |

**源码位置**: `packages/opencode/src/session/index.ts` (行 716, 736, 758, 786, 803)

---

## MessagePart 完整类型定义

```typescript
// text 类型
{
  type: "text",
  text: string,
  sessionID: string,
  messageID: string,
  partID: string
}

// tool 类型 (最重要)
{
  type: "tool",
  tool: string,              // 工具名称: read/edit/write/bash等
  callID: string,
  sessionID: string,
  messageID: string,
  partID: string,
  state: {
    status: "pending" | "running" | "completed" | "error",
    input: any,
    output?: string,
    title?: string,
    error?: string,
    time?: { start: number, end: number }
  }
}

// reasoning 类型
{
  type: "reasoning",
  text: string,
  sessionID: string,
  messageID: string,
  partID: string
}

// 其他类型: file, subtask, step-start, step-finish, snapshot, patch, agent, retry, compaction
```

---

## 详细说明

### message.updated

**触发时机**: 消息内容变化

```typescript
properties: {
  info: Message.Info  // 消息信息
}
```

---

### message.removed

**触发时机**: 消息被删除

```typescript
properties: {
  sessionID: string,   // 会话ID
  messageID: string    // 被删除的消息ID
}
```

---

### message.queue.updated

**触发时机**: 进入排队或位置变化

```typescript
properties: {
  sessionID: string,              // 会话ID
  runningTaskSize: number,        // 正在运行的任务数
  waitingQueueIndex: number       // 等待队列中的位置
}
```

---

### message.part.updated

**触发时机**: 消息部分更新时 (最重要的事件)

```typescript
properties: {
  part: MessagePart  // 完整的消息部分对象
}
```

**实际数据结构示例**:
```json
{
  "type": "tool",
  "tool": "bash",
  "callID": "part_xxx",
  "sessionID": "ses_xxx",
  "messageID": "msg_xxx",
  "partID": "part_xxx",
  "state": {
    "status": "running",
    "input": { "command": "ls", "timeout": 60000 },
    "time": { "start": 1775813130919 }
  }
}
```

---

### message.part.delta

**触发时机**: 文本流式输出时的增量更新

```typescript
properties: {
  part: MessagePart  // 部分更新，包含增量内容
}
```

---

### message.part.removed

**触发时机**: 消息中的某个部分被删除时

```typescript
properties: {
  part: MessagePart
}
```

---

## 使用示例

```typescript
"event": async ({ event }) => {
  switch (event.type) {
    case "message.part.updated":
      const part = event.properties.part
      if (part.type === "tool") {
        console.log("Tool:", part.tool)
        console.log("Status:", part.state.status)
        console.log("Input:", part.state.input)
        if (part.state.status === "completed") {
          console.log("Output:", part.state.output)
        }
      }
      break
    case "message.part.delta":
      // 监听文本流式输出
      console.log("Delta:", event.properties.part.text)
      break
  }
}
```
