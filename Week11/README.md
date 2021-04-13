### 学习总结

本周重学 CSS, 了解到 CSS 分为两类规则, 一类为 at-rules, 另一类为 rules

#### at-rules

+ @charset
+ @import
+ @page
+ @media
+ @couter-style
+ @keyframes
+ @fontface
+ @support
+ @namespace

其中 @media(媒体查询), @keyframes(关键帧), @fontface(指定 font-family) 使用较多, 相对重要

#### rule
+ Selector (选择器)
  + select_group (组合选择器 注意权重 按0,0,0,0 分别的次幂进行计算)
  + selector
    + \> (表示选择子元素)
    + \<sp> (空格 表示选择子孙元素)
    + \+ (表示 选择自己后面第一个兄弟元素)
    + \~ (表示 选择自己后面所有的兄弟元素)
  + simple_selector
    + type (元素名 - 栗子: div)
    + \* (所有)
    + \. (类 - calss)
    + \# (id)
    + \[] (属性 - [attr=value])
    + \: (伪类)
      + 第一批伪类 最早设计出来为了操作 a 标签
      + 树结构伪类
      + 逻辑伪类
    + \:: (伪元素)
      + ::before
      + ::after
      + ::first-line
      + ::first-letter
+ Declaration (键值对)
  + Key
    + variables (--xxx: xxx 可以声明变量)
    + properties (css 属性)
  + Value
    + calc
    + number
    + length
    + ......

通过这一次系统的重学css, 不仅让我复习了之前不经常用的选择器和伪类, 还让我学习到了很多新的伪元素和伪类还有许多 css 的 ar-rules 规则的, 也让我知道了 css 具体的分类, 还学习到了老师对知识的学习方法, 先对知识进行归纳和梳理, 之后在进行系统性的学习。