### 本周总结
本周继续重学 CSS 部分, 从 用于页面布局的最小单位**盒**开始学习, 后续复习到正常流部分, 了解到 IFC 和 BFC 的表现形式, 后续重温 FLEX 布局, 动画, 颜色, 绘制 部分



#### 盒
排版和渲染的基本单位是**盒**, 盒分为两种一个是 普通和模型, 另一种是 border-box

##### 普通盒模型
> 由 content + padding + border + margin, padding 和 border 会增加宽度

##### border-box模型
> 由 content + padding + border + margin, padding 和 border 不会增加宽度, 会减少其 content

#### 正常流
> 现拥有三种布局方式: 1. 正常流, 2. flex, 3. grid

正常流的排版分别为 从上向下(BFC) 和 从左到右(IFC), 并且文字会默认按照一条基线进行对齐, BFC 会产生 margin 层叠的情况发生, 需要解决这种情况需要使当前盒子产生一个新的 BFC, 最容易实现的方法就是 overflow: hidden

float 会影响到正常流的布局, 且多个元素同时 float 相同方向, 会导致float 挨个向下排的情况, 解决方案是使用 clear 解决, float 如果需要换行 也是使用 clear, clear 可以寻找一个没有被 float 影响的新区域

#### flex布局
flex 布局 使用较多, 也是现在最采用的一种布局方案, 由一条主轴和一条交叉轴组成, 用来控制每个盒子在页面上的排版

#### 动画
动画的实现 主要通过 @keyframes 用来控制每一帧的展示, 然后通过 animation 使用 @keyframes 的定义, 还有一种过渡动画 transform 

#### 颜色
主流颜色, 通用 RGB 和 HSL, 用于控制颜色的显示

#### 绘制
> 分为 几何图形 文字 位图
##### 几何图形
+ border
+ box-shadow
+ border-radius

##### 文字
+ font
+ text-decoration

##### 位图
+ background-image


这次重学 CSS 从一开始对 CSS 知识的整体归纳到每一项细致的讲解, 都让我学习到很多有价值的东西, 从 CSS 的布局开始 到后面 动画的展示 和颜色的展示 和几何图形的渲染, 让我又一次学习到了一个全新的 CSS。
