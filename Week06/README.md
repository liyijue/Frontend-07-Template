学习笔记

# 总结

### 本周重学Javascrpit

+ 从一开始的抛开编程语言的层面上, 对语言本身的解析方式和解析方式上学习, 了解到了BNF

+ 在从 javascript 本身7大基础数据类型, 逐一进行讲解, 这7大数据类型: 
  + Number
  + String
  + Boolean
  + Undefined
  + Null
  + Object
  + Symbol


#### Number
数字类型 - 学习到数字类型的存储方式和比较特殊的例子 `0.toString 会报错 0 .tostring 则不会`

#### String
字符串类型 - 字符串类型有许多对应的编码格式 `Utf-8, GBK, ASCll...`

#### 简单数据类型 Boolean Undefined Null
boolean - 布尔类型 含有 `true 代表 真`, `false 代表 假`

undefined - 定义了但无赋值, 是个变量可以被改变, 不建议使用, 用void 0 代替使用

null - 是关键字不允许重新赋值, 代表定义了但是个空值

#### 对象
object - 带表一个类的实物, 对象具有`唯一标识符 行为 状态`, 对象最好只改变自己状态, 不影响其他人的状态

symbol - 代表一个唯一值, 可以用于对象的key值

+ 最好认识了系统内置的一些特殊对象, 例如: Araay, Function, ...
  + Araay 添加元素可以自动增加长度
  + Function 比较特殊有, js引擎可以使用的内置属性, 但开发环境不可以使用, 一般会用`[[xxx]]`, 两个中括号表达此意思
