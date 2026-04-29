# config Hook 详解

## Hook 定义

```typescript
"config"?: (
  input: Config
) => Promise<void>
```

**触发时机**: 插件初始化时接收配置

**文件位置**: `packages/opencode/src/plugin/index.ts` (行 272)

---

## Input 详解

```typescript
input: Config  // 应用配置对象
```

**Config 类型** (主要字段):
```typescript
interface Config {
  version: string
  server: {
    host: string
    port: number
  }
  model: {
    default: string
    provider: string
  }
  experimental?: {
    primary_tools?: string[]
    // 其他实验性配置
  }
  // ... 其他配置项
}
```

---

## 使用场景

### 1. 读取配置
```typescript
"config": async (input) => {
  console.log("Config loaded:", input.version)
}
```

### 2. 根据配置调整行为
```typescript
"config": async (input) => {
  if (input.experimental?.primary_tools) {
    console.log("Primary tools:", input.experimental.primary_tools)
  }
}
```

---

## 注意事项

- 此 Hook 在插件初始化时调用，只执行一次
- `Config` 是只读的，不能修改
- 用于获取应用配置信息
