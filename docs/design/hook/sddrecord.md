# 任务需求  -- 实现sdd 的日志记录的开发 


日志根路径

sdd_log_root : ~/.local/share/opencode/datacom-sdd-nce

是对/usr1/DataCom-SDD/plugin/src/store 的升级开发（ 但是保留该文件夹） 当前任务开发文件夹为 /usr1/DataCom-SDD/plugin/src/hook/sddrecord

功能要求

- 先判断是否是sdd的命令，这部分你可以参考 /usr1/DataCom-SDD/plugin/src/hook/autose 里的 chat.message的hook （ 基于文本开头是否是 /datacom-sdd-nce开头）
- 判断出来是sdd的命令，则进行记录日志的逻辑
    - 抽取session的cwd, 来自ctx.directory  ： 得到目录名，得到该路径的最后的一个名称，在 sdd_log_root 下创建该同名文件夹， 例 ~/.local/share/opencode/datacom-sdd-nce/ccCampusxx
    - 记录元数据，`local_project : 上述的ctx.directory`
    - 
    - 基于 /datacom-sdd-nce 后面的具体的命令和 传入的第一个参数 ，例如 /datacom-sdd-nce:newSpec xxxx 实现功能， 这个xxx 作为id，构建目录 ~/.local/share/opencode/datacom-sdd-nce/ccCampusxx/xxxx/newSpec/
    - 在 该目录下记录其后续的所有的内容，基于该session id，其记录方式与/usr1/DataCom-SDD/plugin/src/store 类似，记录 session.json, 还有subagent_xx.json ，同时还需要记录元数据 meta.json，记录这个命令的输入，记录这个会话
    最终修改的文件，等等，


 接口参考【重要】

- /usr1/DataCom-SDD/ref/datacom-omo/hook_interface.md 参考该中的client的接口方法，具体的使用 你可以在/usr1/DataCom-SDD/ref/datacom-omo 中搜索相应的接口 会有相关的使用案例
- /usr1/DataCom-SDD/ref/hook-event-details/SKILL.md 描述了opencode插件的支持的hook ，和 事件

- 如遇到不确定的地方，尽可能的 基于ref目录下的示例插件代码内容 进行实现




# 任务需求 --- 上述实现的重构

- 1. log的日志路径为 /root/.local/share/opencode/datacom-sdd-nce/session-record

- 2. 按照上述的逻辑 ，会话存储是按照 目录进行的，目录下再根据sdd 的 命令进行保存的 （ 也就是说 如果这个会话的消息没有sdd的标识，则不会进行保存）、
- 3. 保存的执行逻辑为

    - 1. chat.message 和 command_execute_before 触发时，判断是否是sdd命令，即判断其各自的输入的中，是否包含 /datacom-sdd-nce 
    包含 则记录当前的会话ID 为sdd会话，创建对应的log目录，保存metadate （ 基于正则 其后可能是 /datacom-sdd-nce/newSpec 也可能是/datacom-sdd-nce：newSpec ） 有多少个这个命令你先写一个列表写入 newSpec即可，我会后续补充，不影响整体逻辑

    - 2 在chat.messsage.transform的时候触发保存，（判断是sdd）
