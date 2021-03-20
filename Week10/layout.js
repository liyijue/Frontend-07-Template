function getStyle(element) {
  if (!element.style) {
    element.style = {}
  }

  for (const prop in element.computedStyle) {
    let p = element.computedStyle.value
    element.style[prop] = element.computedStyle[prop].value

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }
    if (element.style[prop].toString().match(/^[0-9]\.+$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }
  }

  return element.style
}


function layout(element) {
  if (!element.computedStyle) {
    return
  }

  let elementStyle = getStyle(element)

  if (elementStyle.display !== 'flex') {
    return
  }

  let items = element.children.filter(e => e.type === 'element')

  items.sort(function (a, b) {
    return (a.order || 0) - (b.order || 0)
  })

  let style = elementStyle
  const temp = ['width', 'height']

  // 如果是 父元素是flex 子元素width, height 的 auto 失效
  temp.forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null
    }
  })

  // 给默认值
  if (!style.flexDirection || style.flexDirection === 'auto') {
    style.flexDirection = 'row'
  }
  if (!style.alignItems || style.alignItems === 'auto') {
    style.alignItems = 'stretch'
  }
  if (!style.justifyContent || style.justifyContent === 'auto') {
    style.justifyContent = 'flex-start'
  }
  if (!style.flexWrap || style.flexWrap === 'auto') {
    style.flexWrap = 'nowrap'
  }
  if (!style.alignContent || style.alignContent === 'auto') {
    style.alignContent = 'stretch'
  }

  var mainSize, mainStart, mainEnd, mainSign, mainBase,
    crossSize, crossStart, crossEnd, crossSign, crossBase

  if (style.flexDirection === 'row') {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'rigth'
    mainSign = +1
    mainBase = 0

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }
  if (style.flexDirection === 'row-reverse') {
    mainSize = 'width'
    mainStart = 'rigth'
    mainEnd = 'left'
    mainSign = -1
    mainBase = style.width

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }

  if (style.flexDirection === 'column') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = +1
    mainBase = 0

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }
  if (style.flexDirection === 'column-reverse') {
    mainSize = 'height'
    mainStart = 'bottom'
    mainEnd = 'top'
    mainSign = -1
    mainBase = style.height

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style.flexWrap === 'wrap-reverse') {
    let tmp = crossStart
    crossStart = crossEnd
    crossEnd = tmp
    crossSign = -1
  } else {
    crossBase = 0
    crossSign = 1
  }

  let isAutoMainSize = false
  if (!style[mainSize]) { // 如果 没有设置主轴的宽度
    elementStyle[mainSize] = 0
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      const itemStyle = getStyle(item)
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== '') {
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize]
      }
    }
    isAutoMainSize = true
  }

  const flexLine = []
  const flexLines = [flexLine]

  // mainSpace = 剩余空间 他是父组件主轴上的尺寸
  let mainSpace = elementStyle[mainSize]
  var crossSpace = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const itemStyle = getStyle(item)

    if (itemStyle[mainSize] === undefined) {
      itemStyle[mainSize] = 0
    }

    // 如果子元素上由flex属性 = 说明他是可伸缩的 可以放在一行上
    if (itemStyle.flex) {
      flexLine.push(item)
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      // 剩余主尺寸减去子元素的剩余尺寸
      mainSpace = mainSpace - itemStyle[mainSize]
      // 取一个最大的 副轴
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      flexLine.push(item)
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }
      // 放不下的场景
      if (mainSpace < itemStyle[mainSize]) {
        // 处理旧行 记住剩余的空间
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        // 产生一个新行
        flexLine = [item]
        flexLines.push(flexLine)
        // 新行的主轴和副轴的初始化
        mainSpace = style[mainSize]
        crossSpace = 0
        // 放的下的话 直接放入
      } else {
        flexLine.push(item)
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      // 放入后计算剩余主轴空间
      mainSpace -= itemStyle[mainSize]
    }
  }
  flexLine.mainSpace = mainSpace

  // 用剩余空间处理带flex的属性
  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace
  } else {
    flexLine.crossSpace = crossSpace
  }

  // 单行的情况 只有单行会纯在 剩余空间小于0
  if (mainSpace < 0) {
    let scale = style[mainSize] / (style[mainSize] - mainSpace)
    let currentMain = mainBase
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      let itemStyle = getStyle(item)

      if (itemStyle.flex) {
        // 如果是flex他是没资格加入压缩的
        itemStyle[mainSize] = 0
      }

      // 计算对应压缩比例
      itemStyle[mainSize] = itemStyle[mainSize] * scale

      // 计算元素的起始位置
      itemStyle[mainStart] = currentMain
      // 计算元素的结束位置 mainSign - 是正方向排还是反方向排
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
      // 上一个元素的结束位置是下一个元素的起始位置
      currentMain = itemStyle[mainEnd]
    }
  } else {
    flexLines.forEach(items => {
      let mainSpace = items.mainSpace
      let flexTotal = 0
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const itemStyle = getStyle(item)

        if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
          flexTotal += itemStyle.flex
          continue
        }
      }

      if (flexTotal > 0) {
        let currentMain = mainBase
        for (let i = 0; i < items.length; i++) {
          let item = items[i]
          let itemStyle = getStyle(item)

          if (itemStyle.flex) {
            // 计算felx 所占比的空间大小
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
          }
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd]
        }
      } else {
        let currentMain = mainBase
        let step = 0

        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase
          step = 0
        }
        if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase
          step = 0
        }
        if (style.justifyContent === 'center') {
          currentMain = mainSpace / 2 * mainSign + mainBase
          setp = 0
        }
        if (style.justifyContent === 'space-between') {
          step = mainSpace / (items.length - 1) * mainSign
          currentMain = mainBase
        }
        if (style.justifyContent === 'space-around') {
          step = mainSpace / items.length * mainSign
          currentMain = step / 2 + mainBase
        }
        for (let i = 0; i < items.length; i++) {
          let item = items[i]
          let itemStyle = getStyle(item)
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          // 加上步长 就是间隔
          currentMain = itemStyle[mainEnd] + step
        }
      }
    })
  }

  // 计算 副轴
  var crossSpace = undefined

  if (!style[crossSize]) {
    crossSpace = 0
    elementStyle[crossSize] = 0
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace
    }
  } else {
    crossSpace = style[crossSize]
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace
    }
  }

  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize]
  } else {
    crossBase = 0
  }
  let lineSize = style[crossSize] / flexLines.length

  let step = undefined
  if (style.alignContent === 'flex-start') {
    crossBase += 0
    step = 0
  }
  if (style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace
    step = 0
  }
  if (style.alignContent === 'center') {
    crossBase += crossSign * crossSpace / 2
    step = 0
  }
  if (style.alignContent === 'space-between') {
    crossBase += 0
    step = crossSpace / (flexLines.length - 1)
  }
  if (style.alignContent === 'space-around') {
    step = crossSpace / (flexLines.length)
    crossBase += crossSign * step / 2
  }
  if (style.alignContent === 'stretch') {
    crossBase += 0
    step = 0
  }
  flexLines.forEach(items => {
    // 算出真实的 y轴的尺寸 如果是 stretch 则是整个最大高度 不然是所占的高度
    let lineCrossSize = style.alignContent === 'stretch' ?
      items.crossSpace + crossSpace / flexLines.length :
      items.crossSpace
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      let itemStyle = getStyle(item)

      let align = itemStyle.alignSelf || style.alignItems

      if (itemStyle[crossSize] === undefined) {
        itemStyle[crossSize] = (align === 'stretch') ?
          lineCrossSize : 0
      }

      if (align === 'flex-start') {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
      }
      if (align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize
        itemStyle[crossStart] = itemStyle[crossStart] - crossSign * itemStyle[crossSize]
      }
      if (align === 'center') {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize] / 2)
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
      }
      if (align === 'stretch') {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ?
          itemStyle[crossSize] : lineCrossSize)

        itemStyle[crossSize] = crossSign * (itemStyle[crossSize] - itemStyle[crossStart])
      }
    }
    crossBase += crossSign * (lineCrossSize + step)
  })
}

module.exports = layout
