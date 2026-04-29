# File 相关 Event 详解

## Event 汇总

| 事件名 | 触发时机 | properties |
|--------|----------|------------|
| `file.edited` | 文件编辑完成时 | `{file: string}` |
| `file.watcher.updated` | 文件变化时 | `{file, event: "add" \| "change" \| "unlink"}` |

---

## 详细说明

### file.edited

**触发时机**: edit/write 工具修改文件后立即触发

```typescript
properties: {
  file: string  // 文件完整路径
}
```

**源码位置**: 
- `packages/opencode/src/tool/write.ts` (行 52)
- `packages/opencode/src/tool/edit.ts` (行 152, 230)
- `packages/opencode/src/tool/apply_patch.ts` (行 223)

---

### file.watcher.updated

**触发时机**: 文件监控变化时（外部修改）

```typescript
properties: {
  file: string,                      // 文件路径
  event: "add" | "change" | "unlink"  // 事件类型
}
```

**event 类型说明**:
- `add`: 文件被创建
- `change`: 文件被修改
- `unlink`: 文件被删除

**源码位置**: `packages/opencode/src/file/watcher.ts` (行 69-71)

---

## 使用示例

```typescript
"event": async ({ event }) => {
  switch (event.type) {
    case "file.edited":
      console.log("File edited:", event.properties.file)
      break
    case "file.watcher.updated":
      const { file, event: changeType } = event.properties
      console.log(`File ${changeType}: ${file}`)
      break
  }
}
```
