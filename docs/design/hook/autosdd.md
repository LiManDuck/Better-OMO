# 需求  --- [已完成]

当前开发一个插件，其支持了若干命令，但是需要用户手动输入  多个命令，逐个执行，已对应软件工程的多个部分

其为

/setup ,
/newSpecAuto
/newPlan
/implement 


现在需要再当前的插件目录中，基于opencode的插件机制 实现一个 /autose <spec_id> 命令
该命令会逐个执行上述的command， 其执行方式为每个命令启动一个会话，




 在command的 event的执行前，判断用户是否是触发了这个命令，当确认触发后，则记录该命令 /autose 后面的参数，然后在整个循环中逐个启动 系统里已经有的 /setup ， /newSpec， /newPlan, /newImplement的 命令， 即，当session.idle 事件发生时候，这说明会话空闲，消息已经到达，需要判断当前的整个循环是否结束，如果没结束，各个命令的最终的模型的输出会包含下一个命令的文本 例如 /newspec结束后的最后消息的内容会包含 /new plan ， 写入到plugin/src/hook/autose下 


- 集成到现有的DatacomHook类中
- 集成到现有的log 函数，但是不要与会话日志搞混
- 现有的代码没有导入相应的npm包，进行查找导入


 接口参考


【重要】

- /usr1/DataCom-SDD/ref/datacom-omo/hook_interface.md 参考该中的client的接口方法，具体的使用 你可以在/usr1/DataCom-SDD/ref/datacom-omo 中搜索相应的接口 会有相关的使用案例
- /usr1/DataCom-SDD/ref/hook-event-details/SKILL.md 描述了opencode插件的支持的hook ，和 事件

- 如遇到不确定的地方，尽可能的 基于ref目录下的示例插件代码内容 进行实现




# 更正任务 -- [已完成]

- autose.ts 移动到autose目录下
- 我新增了这些命令的  constant.ts
- 日志内容记录到 ~/.local/share/opencode/datacom-sdd-nce/autose的目录下
- 架构改动
    - 摒弃流水线的方式，检测下一个命令是依靠 直接判断最后一个模型输出的 是否包含 constant的命令的标识【 每个命令完成后 其输出都会包含下一个命令的标识（这是这些命令的约束）】
    - pipeline的状态管理无用，只需要在command execute before 时候判断是否是autose command ，是的话标记下当前的这个session是一个autose的session ，在session.idle的时候，如果发现该session id是标记的autose，则执行最后一条消息的检查，判断是否有命令的标记，有的话，使用promptasync 发送这个命令的消息 ，如果是autose的话 先触发的是
    - 这样只有/autose 才会触发上述流程，单独的命令不会触发上述流程
    - 额外内容： 自动清理该会话的历史消息，即 如果从
    - 日志保存 ：

    - 自动导入命令的文本，构造我在constant.ts 里设定的command的内容，在~/.config/opencode/extensions/datacom-sdd-nce/commands目录下寻找所有的md文件 ，你可以在我的本地的目录去找一下，其未来的实际应用时格式与之类似，抽取命令，文本内容即， 我会在未来创建autose这个md，这个你暂时不用管
    - 注意： 触发下一条消息的时候，不是传入 /newSpec 这种命令 而是将newSpec这个的command的文本传入，且 必须再添加上 /autose 这个命令的后续的参数（ 即 你需要记录下来）





# 重构任务 -- [已完成]

问题 ：
- 实现过复杂，不需要这么多文件，单独构造以个autosemanager类，记录sessionid 是否 存在，提供添加和移除的方法，
- 一个command-loader 文件即可，只需要一个即可，load默认目录下（将其放在constant里）的所有的md文件，
- 不再使用client.session.promptasync, 而是直接采用command 命令， 参考该接口所在的/usr1/DataCom-SDD/ref/CodeAgentOC-master/packages/sdk/js/src/v2/gen/sdk.gen.ts 这个文件的 2186行开始的 public command<ThrowOnError extends boolean = false> 接口
- 一个index.ts （不要autose.ts）

**最终实现**：
- manager.ts: AutoSeSessionManager 类，管理 session 状态
- command-loader.ts: 从 commands 目录加载 .md 文件
- constant.ts: 命令标识常量
- index.ts: 主入口，包含 AutoSEHook 类和相关处理逻辑
