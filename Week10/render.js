const images = require('images')

function render(viewport, element) {
  // 如果有样式就进行绘制
  if (element.style) {
    let img = images(element.style.width, element.style.height)
    
    if (element.style['background-color']) {
      const color = element.style['background-color'] || "rgb(0,0,0)"
      color.match(/rgb\((\d+),(\d+),(\d+)\)/)
      img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3))
      viewport.draw(img, element.style.left || 0, element.style.top || 0)
    }
  }

  // 有孩子节点 便利孩子节点
  if (element.children) {
    for (const child of element.children) {
      render(viewport, child)
    }
  }
}

module.exports = render
