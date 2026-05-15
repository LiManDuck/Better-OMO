

# reminder 机制开发


reminderEntry 
{
    tag ： string
    reminder
    content : string
}



# hook触发点
## reminder信息注入
`chat.message.transform` : 
    - 从reminderManager里获取所有的累积的reminder , 按照 <tag> content</tag> 的方式 追加到此hook的output的message列表里的最后一个message中的text part 中去

    - 清空已追加的reminderEntry


# reminder信息注册

- 提供一个对外的接口，允许使用放进行注册entry
- 实现下列自带的reminder机制，每个reminder机制在该目录下进行新建 reminder/xxx/index.ts

    - 1. taskInfoReminder 
        触发点：
         每个tool.execute.before : 判断是否是task的tool name ,是的话，记录其id和desc subagent type
         ```json
        {
  description: string  // 任务的简短描述（3-5个词）
  prompt: string       // 要执行的任务内容
  subagent_type: string // 使用的子代理类型（如 "code-reviewer" 等）
  task_id?: string     // 可选，用于恢复之前未完成的任务
  command?: string     // 可选，触发此任务的命令
}
         ```
         每个tool.executer.after 之后， 汇总当前所有的累积的上面的这个tool历史

        组成一个reminderEntry，其content是 类似
        ```
        以下是你历史工作中调用的task工具完成的子任务
        task_id : , desc: task_type 
        task_id : desc :   task_type：

        如果你对过往的这些任务中的细节内容有需要问询或需要其继续完成其工作内容的话 ，再调用task 使用相同的id  
        如需要调用task完成新的任务，请不要传入上述task id 

        ```




