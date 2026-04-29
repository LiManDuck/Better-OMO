# Session 相关 Event 详解

## Event 汇总

| 事件名 | 触发时机 | properties |
|--------|----------|------------|
| `session.created` | 新建会话时 | `{info: SessionInfo}` |
| `session.updated` | 会话信息变更时 | `{info: SessionInfo}` |
| `session.deleted` | 删除会话时 | `{info: SessionInfo}` |
| `session.diff` | 代码差异变化时 | `{sessionID, diff}` |
| `session.error` | 会话发生错误时 | `{sessionID?, error}` |
| `session.idle` | 会话空闲时 | `{sessionID}` |
| `session.status` | 会话状态变化时 | `{sessionID, status}` |
| `session.compacted` | 会话压缩完成时 | `{sessionID}` |
| `session.compacted_before` | 会话压缩前 | `{sessionID, model, messages}` |
| `session.compacted_after` | 会话压缩后 | `{sessionID}` |

**源码位置**: `packages/opencode/src/session/index.ts` (行 305, 340, 350, 692, 716)

---

## SessionInfo 完整类型

```typescript
interface SessionInfo {
  id: string              // 会话ID (如 "ses_2894a0558ffe509lRkaBSP8jh1")
  slug?: string          // 会话slug (如 "happy-island")
  version?: string       // 版本号
  projectID: string      // 项目ID
  directory: string      // 工作目录
  title: string          // 会话标题
  parentID?: string      // 父会话ID (子代理会话)
  permission?: Array<{   // 权限配置
    permission: string
    pattern: string
    action: "allow" | "deny"
  }>
  time: {
    created: number      // 创建时间戳
    updated: number      // 更新时间戳
  }
}
```

---

## 详细说明

### session.created

**触发时机**: 新建会话时

```typescript
properties: {
  info: SessionInfo  // 会话信息 (完整结构见上文)
}
```

**实际数据结构示例**:
```json
{
  "info": {
    "id": "ses_2894a0558ffe509lRkaBSP8jh1",
    "slug": "happy-island",
    "version": "1.2.27.1.2601.02-IN.alpha.0410001",
    "projectID": "4f470b09939bf5e8adc53f151c62f07d9b4d9313",
    "directory": "C:\\Users\\m00949447\\Desktop\\codetrace",
    "title": "New session - 2026-04-10T09:25:30.919Z",
    "time": { "created": 1775813130919, "updated": 1775813130919 }
  }
}
```

---

### session.updated

**触发时机**: 会话信息变更时 (标题、分享链接等变化)

```typescript
properties: {
  info: SessionInfo  // 更新后的会话信息
}
```

---

### session.deleted

**触发时机**: 删除会话时

```typescript
properties: {
  info: SessionInfo  // 被删除的会话信息
}
```

---

### session.diff

**触发时机**: AI 修改代码后触发

```typescript
properties: {
  sessionID: string,
  diff: Array<{
    file: string           // 文件路径
    status: "added" | "deleted" | "modified"
    additions: number     // 新增行数
    deletions: number     // 删除行数
  }>
}
```

---

### session.error

**触发时机**: 会话发生错误时 (LLM调用错误等)

```typescript
properties: {
  sessionID?: string,
  error: {
    tag: string            // 错误类型标签
    message: string       // 错误信息
  }
}
```

---

### session.idle

**触发时机**: AI 停止响应、会话空闲时

```typescript
properties: {
  sessionID: string
}
```

---

### session.status

**触发时机**: 会话状态变化时

```typescript
properties: {
  sessionID: string,
  status: {
    state: "busy" | "idle" | "retry" | "queued"
    // ... 其他状态属性
  }
}
```

---

### session.compacted

**触发时机**: 会话压缩完成时

```typescript
properties: {
  sessionID: string
}
```

---

### session.compacted_before

**触发时机**: 会话压缩前

```typescript
properties: {
  sessionID: string,
  model: Model,
  messages: MessageV2[]
}
```

---

### session.compacted_after

**触发时机**: 会话压缩后

```typescript
properties: {
  sessionID: string
}
```

**源码位置**: `packages/opencode/src/session/compaction.ts` (行 231, 262, 355)

---

## 使用示例

```typescript
"event": async ({ event }) => {
  switch (event.type) {
    case "session.created":
      console.log("New session:", event.properties.info.id)
      break
    case "session.updated":
      console.log("Session updated:", event.properties.info.title)
      break
    case "session.diff":
      console.log("Code diff:", event.properties.diff)
      break
    case "session.error":
      console.log("Session error:", event.properties.error)
      break
  }
}
```
