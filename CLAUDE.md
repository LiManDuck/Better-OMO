# 项目背景

你正在和我合作开发一个企业内部的opencode的插件, 其不从头开始开发，基于已有的一个opencode插件为 oh-my-opencode(简称omo)在此基础上进行修正
这两个代码仓代码在ref目录下（ref已被写入.gitignore ）
ref/
    - opencode
    - oh-my-opencode
当你看到@opencode-ai 类似的包表明你需要去opencode下去找 
omo插件是基于opencode中的plugin 包对外的接口（ref/opencode/packages/plugin下），通过hook event agent skill等字段允许特定的逻辑 和 组件进行注入
你的任务是合作基于此omo插件  实现 定制版的插件逻辑 遵循我的需求 , 最终名为 better_omo 插件   也就是本目录下的项目
# 你的要求

- 你可以查看skill下的 opencode hook guider ，也可以直接查看ref/opencode/packages/plugin 的包 ，进行确认plugin里包含的接口的形状 不要猜测接口形状
- 最终成品是一个类似oh-my-opencode的一个完整的ts项目, ref目录不参与git 
- 遵循我的指令，一直往下执行，从信息收集，方案思考到代码编写，编译验证 无需向我询问 ，除非你认为完全不可行


# 迁移重构任务执行 规范

- docs目录存放你的设计文档,  迁移指导 ( 我会和你共同 审核和修改) 要求你所有生成的 docs目录下的内容, 在此处留下一个快照（如下所示）
    - immigration_guide.md : omo迁移开发的指导, 其是omo 设计较差的部分的分析
    - omo_analyse.md  ： omo项目的功能设计  
    - immigration_plan.md  : 完整开发计划（ 如不存在，请先创建） ; 如果存在 检查待做计划 ； 如果计划全部完成; 检查是否合理，是否需要新增计划 （遵循以下要求判断）


- 
- .work 目录存放你的自己的内容 ( 这是完全属于你的内容, 我不干涉)，至于有哪些内容 你可以如上所示的在这里留下一个快照
- 注意 你的代码仍然写到本目录下，不要写入到.work
- 优先完成核心逻辑 最后才是readme, 等附属文件
- 如果可以, 使用gitworktree并发工作
- 代码本身是最重要的知识参考, 如有怀疑和不确定, check代码优于文档
- ref目录存放omo和opencode源代码，这是你的重要参考，最高等级参考



# 代码实现要求

- 常量必须存放constant 下，严禁直接照搬omo代码 大量的常量 字符串 散落各处
- 代码的架构设计你可以参考oh-my-opencode的源码 
- 保证可扩展性 , 原有omo的优秀设计保留; 重构其常量，类型定义四处漂移的部分； 删除其多agent编排逻辑 ，其余不变
- 定时进行commit 和 git push( 直接push即可，不用设置分支 )


# 功能要求
- 去除omo插件中的多agent编排体系, 保留explore（ 只有读权限） , general( 所有能力都具有的子agent), look-at(即多模态那个子agent) ,对于主agent 提示词留空（我会自行填写，暂时只需要一句话 you are bt-omo , a good code agent 即可 
- omo中由于自行定义了agent, 覆盖掉原有的opencode的子agent逻辑, 但是better-omo里同样会读取opencode里其他的agent, 遵循opencode里的逻辑, 读取~/.config/opencode/agents下的用户自定义agent md
- 保留现有的Task工具里会传入categroy的机制 , 新增一个 fork参数，该参数默认设置为true, 其为是否继承主agent的所有历史上下文
- tmux的功能保持不变
- skill , mcp的功能保持不变  
- tool 功能保持不变   保留内置的tool
- hook进行删减，原本sisyphus等多agent编排,对应逻辑的的部分完全不需要 进行删除 ; 其余保留
- 在~/.config/opencode下支持本插件的配置, 记为 bt-omo.json文件 
- 如若遇到上述没提到的功能要求, 则一律视为保留原有omo的能力 
- 移除所有的与特定模型强绑定的逻辑，例如gemini， 例如claude 
- 新增两个agent, clawcoder和autose,


# Attention

- 你不仅是在做功能删减 同时还是在代码重构
- 定期执行git commit , 每当你完成一些功能之后 注意 所有你自己提交的commit , commit 格式都是 "cc : <实际的commit信息>"  

# omo中概念 （ 帮助你更好理解omo的设计）


##   variant = 推理努力程度等级
通过调整 API 调用时的特定参数，让模型用"更努力"或"更简单"的方式来回答问题。

thinking: { type: "adaptive" }, 
effort: "high"  // variant 

# 重构 设计

- 所有的底层的type （ 包括bt-omo自身定义，来自opencode的对外接口 例如 工具数据结构，消息数据结构，） 统一存放在 ，各个子特性自身的type，常量等存在其自身代码实现所处位置 例如（ Omo中的/usr2/better_omo/ref/oh-my-opencode/src/hooks/agent-usage-reminder/index.ts 其tool的输出输入的数据结构应该是整个系统统一的，不要在这里额外定义 会造成散弹式修改） 类似这样的重复定义和类型声明在omo的hooks里到处都是


- system reminder作为一个独立的系统，其触发只会在发送用户消息，和工具执行完之后，作为附加消息的添加上，现有的omo实现是各个子组件自行添加（ 例如 /usr2/better_omo/ref/oh-my-opencode/src/hooks/agent-usage-reminder/index.ts 里的   output.output += REMINDER_MESSAGE; )  单独设计一个reminder系统，新增reminder 只需要在这个系统里新增一个触发函数即可







# 重构 detail

## 新的目录结构

-- config 
    -若干schema

-- agent（ 插件自带 agent)
    - schema.ts
    --- clawcoder
    --  autose
-- tool ( 插件自带工具)
    -- 

-- system-reminder ( 定义各种不同的reminder触发机制，复用 context-injector)


-- utlis
    -- skill-loader 
    -- command-loader
    -- tmux-manager ( 合并src/features/tmux-subagent/manager.ts 和  shared/tmux 内容)



## config 重构



1， BtOmoConfig 允许用户自行配置的字段

- provider 
- 模型配置

- 环境变量配置
- 

1. opencode plugin里的类型， 后续所有的都从这里导入（ 防止opencode plugin版本更新导致霰弹修改）



导入类型，不要类型到处都是 : opencode-plugin-type.ts ( 后续统一从这里导入)

- hook名称
- 消息类型  Message :  Info { role, sessionId } ； Parts : [Part] 
- 导入类型

定义统一的获取方法




## agent 系统

添加一个新的默认的agent

claude-code, 在此模式下其system reminder会与cc一致

同时补充cc的team机制，memory机制


子agent保留

explore


## 内置skill

-  


## slash 斜杠命令系统

/role 添加 
/btw 添加






## 机制新增

新增system reminder的机制 , 其基于特定条件，往消息里新增内容(参考claude-code中的message.ts)



## 机制移除（ 在实现bt-omo的过程中，你不需要这些omo的机制和设计）


- 移除检测claude code的hook 
- 无需为模型或任务设置不同的推理参数，即 推理等级等等
-  


## 机制保留 
- 保留tmux系统
- 保留并发控制系统 ConcurrencyManager（src/features/background-agent/concurrency.ts）实现三级粒度并发控制：
- 保留任务难度路由到不同的模型（ 与上述的并发控制联动） 
- 保留background manager 

## hook系统

保留
- better_omo/ref/oh-my-opencode/src/hooks/anthropic-context-window-limit-recovery
- 保留autoslashcommand
  

## tool系统

- 保留slashcommand
- 保留delegate_task 工具
- 移除call_omo_agent 
- 移除websearch等web类工具

保留

- bash执行时候检测 终端（unix, cmd,ps） 并执行命令的路径检测 shellEscape  


## system reminder 机制

- bash工具
  - 失败时候或返回为空 提醒当前bash版本
  - cp 命令，mkdir等等命令的操作
  - 危险命令的再三确认 

 

##  "chat.message" 收到新用户消息时，消息入队前 


##  "experimental.chat.messages.transform" 


##   event

### if (event.type === "session.error")

是可恢复类型，则进行会话恢复，发送 continue文本

###  if (event.type === "message.updated") 


更新session 的 agent名称 

###  if (event.type === "session.deleted")

清空资源，
###   if (event.type === "session.created") 

为其启动tmux 

记录父会话id



##  config  : 启动时将信息注入到config数据里


##  "tool.execute.before"



