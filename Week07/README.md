### 第七周学习
+ 运算符
+ 类型转换
+ 声明
+ 宏任务和微任务
+ 函数
+ 引擎里面 Realm

##### 运算符
js 中包含 + - * / += -= *= /= ** 等运算符, 用于计算, 且注意 / /= 会有精度丢失的问题

##### 类型转换
js 中有显示转换和隐式转换, 显示转换是将类型变为另一个类型的包装对象进行转换, 隐式转换是在做运算时和逻辑运算的时候进行转换

##### 声明
js 中声明, var 会存在变量提升的问题, 但现在一般不用, var 会产生很多问题, 一般用let 和 const

##### 宏任务和微任务
js 引擎会从任务队列中取任务执行, js 引擎主动产生的任务是微任务, 先执行一个宏任务然后如果有微任务把微任务执行完只会在取任务队列里的任务, 一直反复, 就形成了**事件循环 even loop**, 微任务会由**Promise**产生

##### 函数
函数是用于处理一系列问题的封装

##### Realm
Realm 是一个环境, 一个独立互不干扰, 内容相同的环境
