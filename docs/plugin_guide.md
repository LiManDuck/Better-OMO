# 插件开发参考

ref 目录内容
## 源码
/CodeAgentOC-master ： 插件主体, 其对外暴露的包为 sdk 和plugin , 本插件开发基于此两个包对外提供接口开发
    - ref/CodeAgentOC-master/packages/sdk/js ： 参考其js 的 sdk 对外接口
    - ref/CodeAgentOC-master/packages/plugin ： 插件对外的event类型 ，hook类型在此定义

ref/CodeAgentOC-master/packages/sdk/js/src/gen/sdk.gen.ts ： 在这里看到sdk的对外接口 例如 client.session.promptasync 等方法在此定义


## 已有成品插件参考
/ref/datacom-omo
/ref/opencode-scheduler

这两个是开源的插件，这可以作为你实现插件的参考代码，参考其使用的接口方式，plugin的定义

## 文本参考
ref/hook-event-details：
整理的plugin的hook，event等事件类型 ： /ref/hook-event-details/references
整理的sdk 接口 ： /ref/hook-event-details/sdk



# 插件开发指引 


- 对于plugin的hook结点 事件等先去阅读 
/ref/hook-event-details/references/00_Hook_Event_汇总.md 基于需要的event类型或hook类型 再去/ref/hook-event-details/references/ 下阅读对应的文档

- 对于sdk的client的接口
DataCom-SDD/ref/hook-event-details/sdk 先去该目录下读取文档 。对于类型 长什么样子 你可以去该目录下的types.md文档或直接去ref/CodeAgentOC-master/packages/下的相应目录直接阅读源码
