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




# agent dev guide

the most important ability of agent development is to build a agent loop,  invovles long-term memory , long-time running ,
proper tool ability and  context controlability , by the way , maybe the next generation of the agent ability dev is to 
make agent a full-like computer system , with cache , memory , cpu , multi-level cache , pipeline parapel , 
just like context window,  llm decode, mulit subagent



ok ,let's return the point , about agent dev , the next question is how to build a good agent loop , absolutely ,claude code  is a
good example standing before everyone, subagent ,todowrite , give necessary tools and autocompress. a loop for the task spliting , tracking 


omo is another example of it , complext task transfering among multi agents, a loop focus task switching and routering in a specific path , maybe a good solution 
for complex tasks  

think about what we expect for agent working in our coding process :

- exactly follow what we said in the prompt , defined clearly working process 
- chcek the fibal results , evaluate is it what we want 
- about coding 
    - is it a good implement way and design 
    - is it full implement  what we prompt
    - is it considers the implict command and the sides
    - is anything forgetten 

what problems we facing in llm coding:
- unrelevent much tool call just for finding some target file or class or function or writing 
- context window do not dynamic truncting   
- llm has its own executing preference after training , sometimes it will not follow your instructions ; like how to 


after thinking what is the problem of what we are facing in using llm coding ,  next you may thinks of some solution ways, 
prompting , adding tools or skills, changing the working process like transfer some tasks to a specific agent .

but those ways above , do not think the questions into a agent loop, improve yourself using these ways will not improve you as 
a agent software engineering , back to end , most import thing is to design a loop


so next is what loop we want to build to fix problems above we list :
- strictly follow our instrucitons even its too complex and not expressed explicitly 
- context window desgin for exercise context control : remove useless , time-out messages
- cost consider : make hardest effort for kv cache reuse



here is some desgin :

- coding task is more like a sequence task , design ->  coding -> testing , information needs to saved  and could be refind
the most important way is to find enough current repo coding structure , relevent document , and make it can be edited and reviewing shared 
in all steps

- CkptTask
    - subagent with current full message history , finishing tasks , a

- double agent loop 
    - trackingagent : share all full history --> firstly 
- hook
    - autose


# SDD dev 

- commands
    - /auto 
    - /req



# reference 

- https://github.com/gotalab/cc-sdd  ： sdd开发插件
- https://github.com/LiorCohen/sdd ： 
    上述都是定义命令，ai运行命令

- https://github.com/linfee/spec-kit-cn ： sdd （spec driven dev）的prompt




# 总体设计

- sddagent
    - 通过命令直接触发相关阶段 /sdd:implement  等

- tool
    - write ： 在长文本中，write工具具有一旦触发难以回头（可能包含大量输出） ，在长文本write之后，reminder提醒逐章check 和 内容填充 

    - task: task工具在代码编程里应当具有上下文一致性 （ kv cahche很便宜） ，建议模型进行并发执行， 优势使用场景 
         例如在逐章check的时候进行 六个task 分别逐章check, 这样所有的都保留了 模型记忆和 实现 
         coding的场景的问题是，很多时候你必须拥有全部的上下文才能保证推理质量，例如某个小的地方错了，其实是整个的架构错了； 修改某个地方
         不能进行并行，但有时候又可以并行；例如架构一修改，只要主agent可以实现

    
    - task工具的check : 允许模型

    - 分段式压缩： 到达一定长度后，主动提醒模型进行小范围的压缩

    - command的塞入长下文

- sdd命令设计
    - 单个sdd结束后必须主动汇报当前结束的核心要点
    - 不要进行线性的逐个执行，否则当需要进行修改的时候必须回退到

- 上下文问题
    - 保存每个命令的所有的上下文，新的命令一旦触发，则保留上一个命令的最后一条输出和最新的命令的text

    - 允许使用命令进行回退到上个命令阶段，  例如 /sdd: implement的时候发现问题，或者用户提出问题，模型通过 /sdd:plan 这时候因为有历史上下文，
    直接进行回退到历史上下文中，
