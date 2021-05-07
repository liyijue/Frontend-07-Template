### 本周总结

本周学习了两个大主题的封装和实现, 分别为 动画 和 手势事件

#### 动画

动画学习了利用 js 实现 css animation 的效果, 分为 四个阶段 :

1. 建立动画和时间线, 时间线中存储着许多动画, 在一定时间到达后开始执行动画, 一定时间结束动画

2. 添加动画 暂停 和 重启, 暂停时需要记录暂停时间, 重启后减去对应时间, 这个思路可以实现这两个功能

3. 动漫添加贝塞尔曲线曲线, 和 重置功能

4. 给动漫添加状态管理

动漫类上的所有状态代表的意义

```javascript
this.object = object; // 需要做动画的源对象 -- 元素
this.property = property; // 属性名
this.startValue = startValue; // 开始值
this.endValue = endValue; // 结束值
this.duration = duration; // 动画持续时间
this.delay = delay; // 延迟时间
this.timingFunction = timingFunction || ((v) => v); // 塞尔曲线曲线
this.template = template || ((v) => v); // 计算后值的包装

// 计算公式 开始值 * 范围 * 塞尔曲线曲线(当前时间 / 持续时间)
const range = this.endValue - this.startValue;
const progress = this.timingFunction(time / this.duration);
this.startValue + range * progress;
```

#### 手势

手势是通过原生的 mouse 和 touch 事件上, 通过各种判断的方法, 产生出 轻触(tap) 长按(press) 滑动(pan) 快速滑动(flick), 实现分别三个阶段

##### 对原生事件的绑定

在 pc 端 对于鼠标事件的绑定是在 鼠标点击(mousedown)后进行接下来的捆绑 鼠标移动(mousemove) 和 鼠标松开(mouseup), 其中较为麻烦的处理是 对于鼠标不同按键的同时点击后的判断触发哪类拓展事件(这一部分还不太懂, 只是知道需要在 map 中设置需要 key 即可取出对应数据), 对于 移动 端, 就不需要在 触屏(touchstart) 后在进行捆绑注册事件, 分开注册事件即可, 因为在移动端需要触发 touchmove 事件必定会触发 touchstart 起, 所以只需要分别注册 touchstart, touchmove, touchend, touchcancel 即可, touchcancel 是在特殊情况下丢失触摸后触发, 因为移动端存在多手指同时触发, 所以也需要对应标识存储对应数据, 这里的解决方案是使用, touch 事件对象中的 changedTouches, changedTouches 是一个数组, 数组代表有多少个 触屏点, 每个数组中对象都会有 identifier 唯一标识符, 所以可以使用这个达到目的。

##### 对不同操作的解析产生自定义拓展事件

拓展事件含有 轻触(tap) 长按(press) 滑动(pan) 快速滑动(flick), 每一项的触发条件都有所不同, 根据元素事件会产生 四个方法 在 这四个方法中进行逻辑判断具体触发哪个事件, 这四个方法分别为: start, move, end, cancel

1. 轻触(tap) 的触发条件是在 500mm 以内触摸屏幕后离开且不产生大于 100px 的移动距离

2. 长按(press) 的触发条件是在 超过 500mm 触摸屏幕后离开且不产生大于 100px 的移动距离

3. 滑动(pan) 的触发条件是在 触摸屏幕后产生大于 100px 的移动距离

4. 快速滑动(flick) 的触发条件是在 触摸屏幕后产生大于 100px 的移动距离 且速度到达一定标准计算公式为 (触摸的 x 轴 - 500 毫秒以内最近一次触摸点的 x 轴 的平方 减去 触摸的 y 轴 - 500 毫秒以内最近一次触摸点的 y 轴 的平方) / (当前时间 - 500 毫秒以内最近一次触摸点的时间) 的值是否大于 1.5

```javascript
d = Math.sqrt(
  (point.clientX - content.points[0].x) ** 2 +
    (point.clientY - content.points[0].y) ** 2
);
v = d / (Date.now() - content.points[0].t);

v > 1.5 ? "成立" : "不成立";
```

##### 绑定拓展事件到元素上

使用的是 event 对象 和 元素的 dispatchEvent, 在拓展事件满足不同条件后注册, 且 type 是事件名, properties 代表要给事件输出的事件对象, 传入一个对象后把对应的 key 和 value 添加到 event 上

```javascript
dispatch(type, properties) {
    const event = new Event(type)
    for (const name in properties) {
      event[name] = properties[name]
    }
    element.dispatchEvent(event)
  }
```


##### 整体总结

本周内容较多, 需要花时间进行消化, 很多东西只是跟着视频一起实现了, 先了解了设计思路和设计实现方案, 只是看懂了大部分而已, 具体有些判断取出对应的 content 利用掩码的那部分还未看懂, 后续需要自己思考。
