# 实现本插件的公共的方法 -- 记录sdd_session_status



从/usr1/DataCom-SDD/plugin/src/hook/autose （不要修改该文件夹）

- 1. 提取导出所有datacom-sdd-nce的commands文本的方法
- 2. 基于该hook和plugin的概念（/usr1/DataCom-SDD/CLAUDE.md） 

    构建一个SDDStatus类

    对外提供 ： 
    - 基于sessionid返回当前所处的sdd命令 ，需要定义sdd命令的常量 参考/usr1/DataCom-SDD/plugin/src/hook/autose ，
    - 改变session_id 的所处的sdd命令的对外接口

    实现：

    基于chat.message 的这个hook 和 command_execute_before这个hook 进行判断，一旦判断成功，则进行标记，并按照正则抽取其sdd后面的具体命令进行判断

    
