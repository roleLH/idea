# 异步代码的一点思考
无论学习还是工作中，总是会接触这样的逻辑：一段调用并不会立刻产生结果，而是在未来某一时刻才可以判定是否完成这段操作。  
要说问题的来源，大部分情况都是在进行io操作（原谅我想不到其他场景了）。读写数据库，发送接收网络包等等，正常情况下是没人希望会堵塞在这个地方的。  
要说的话，最简单的方式，就是使用回调函数。
## Callback
一种常见的使用方式:
``` javascript
dbmgr.exec(sql_str, (eno, results)=>{
    if(eno != SUCCEED) {
        // something error
        return
    }
    // ......
    // run you code
});
```
这种方式是显而易见的，当数据库任务完成后就会在某一时刻调用我们写的回调函数。实际上在后端代码中，设计合理，并不会产生所谓的[回调地狱]()，回调的层数不会太多。我见的大部分情况是这样的：
``` javascript
dbmgr.exec(sql_str, (eno, results)=>{
    // 错误处理
    post_data = results
    httpclient.post(service_ip, post_data, (rsp)=>{
        // 错误处理
        if(rsp.ok) {
            client.send(some_thing_ok);
        }
    })
})
/** 流程大致为，获取数据库中用户的一些信息，发送至某个业务流程处理服务，
 * 成功后返回给客户端一些信息。看起来还好。。。
 */
```  
经常出现的情况反而是 
1. 由于读取完数据要进行大量的业务流程操作，一不小心全部写在回调里面导致**阅读调试困难**，后期维护也是一个坑
2. 有的运行环境在触发回调函数的时候运行在了新的上下文，导致丢失了部分原有的业务逻辑环境，这就会导致回调函数中**报各种null值**。
    
当然，这些都是可以通过调整代码结构来避免的。  
(当你想要调试一个报null错误，发现回调中有几百行逻辑，你就知道它的威力了)  
要说的话，回调应该是最朴素的一种方式，没有提供任何在这之上的包装。除了回调还有什么？  
## Promise  
有段时间就跟着魔一样，就是特别想知道 javascript 中的 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 是怎么实现的。ok，那就暂时在这里说两句吧。   
