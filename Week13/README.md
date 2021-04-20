### 学习总结

#### 重学 HTML 和 浏览器 Api

#### HTML
+ HTML 标签语义
  + head
  + main
  + footer
  + asid
  + ...

+ 字符引用
  + \&#161; --- \!
  + \&amp; --- \&
  + \&lt; --- \>
  + \&quot; --- \"

#### DOM API
##### 导航类操作

+ Node
  + parentNode
  + childNodes
  + firstChild
  + lastChild
  + nextSibling
  + previousSibling

+ Element
  + parentElement
  + children
  + firstElementChild
  + lastElementChild
  + nextElementSibling
  + prviousElementSibling


##### 修改操作

+ appendChild
+ insertBefore
+ removeChild
+ replaceChild

##### 高级操作

+ compareDocumentPosition --- 用于比较两个节点中的关系
+ contains --- 检查一个节点是否包含另一个节点
+ isEqualNode --- 检查两个节点是否完全相同
+ isSameNode --- 检查两个节点是否是同一个节点, 在 Javascript 中可以用 '==='
+ cloneNode 复制一个节点, 如果传入参数 true, 则会连同子元素做深拷贝

#### 事件Api

##### addEventListener
> 第三个参数默认为 false 代表冒泡, 为 true 则为捕获, 相同元素的相同事件可同时支持冒泡和捕获

#### Range Api

```javascript
// 创建一个区域 设置开头位置和尾部位置
var range = new Range()
range.setStart(element, 9)
range.setEnd(element, 4)

// 获取画的一个区域
var range = doucument.getSelection().getRangeAt(0)

// 将 区域内所以 dom 取下来 且可以操作
const fragment = range.extractContents()
```

#### CSSOM

+ document.styleSheets 获取当前页面的 样式字典
+ CSSOM View
  + window.innerHeight, window.innerWidth
  + window.outerWidth, window.outerHeight
  + window.devicePixelRatio --- 获取 设备的物理像素和 px 的比例
  + window.screen
    + window.screen.width
    + window.screen.height
    + window.screen.availWidth
    + window.screen.availHeight
  + window.opne("url", "_blank", "width=100,height=100,left=100,rigth=100")
    + moveTo(x, y)
    + moveBy(x, y)
    + resizeTo(x, y)
    + resizeBy(x, y)
  + scroll
    + element
      + scrollTop
      + scrollLeft
      + scrollWidth
      + scrollHeight
      + scroll(x, y)
      + scrollBy(x, y)
      + scrollIntoView() --- 滚动到可视区
    + window
      + scrollX
      + scrollY
      + scroll(x, y)
      + scrollBy(x, y)
    + Layout
      + getCilentRects() --- 获取所有的盒
      + getBoundingClientRect() --- 获取一个盒可获取在视图上的属性


#### 总结
本周学习了 HTML 及 浏览器的 APi , 其中 HTML 的重点部分是 语义化标签, 和 字符引用, 字符引用需要记住几个特殊的 \&lt; \&quot; \&amp; , 后续学习了浏览器的 API , 其中可以规划为 事件API DOMAPI CSSOM 其他API 这四种, 事件 API 的重点是 冒泡和捕获, DOMAPI 是对于 DOM 的各种灵活操作, 其中 Range API 对于操作 DOM 的性能方面有很好的提升, CSSOM 分为 样式的操作 和 对视图的操作。
