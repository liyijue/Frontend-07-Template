import { Component } from './framework'

export class Carousel extends Component {
  constructor() {
    super()
    this.attributes = Object.create(null)
  }

  setAttribute(name, value) {
    this.attributes[name] = value
  }

  render() {
    this.root = document.createElement('div')
    this.root.classList.add('carousel')
    for (const record of this.attributes.src) {
      const div = document.createElement('div')
      div.style.backgroundImage = `url(${record})`
      this.root.appendChild(div)
    }

    const children = this.root.children
    let position = 0

    this.root.addEventListener('mousedown', event => {
      const startX = event.clientX

      const move = event => {
        const x = event.clientX - startX
        const current = position - ((x - x % 500) / 500)

        for (const offset of [-1, 0, 1]) {
          const pos = (current + offset + children.length) % children.length
          
          children[pos].style.transition = 'none'
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`
        }
      }
      const up = event => {
        const x = event.clientX - startX
        // 从左向右移动 x 为负数
        position = position - Math.round(x / 500)
        for (const offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
          const pos = (position + offset + children.length) % children.length
          children[pos].style.transition = ''
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500}px)`
        }

        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    })

    // let currentIndex = 0

    // setInterval(() => {
    //   let nextIndex = (currentIndex + 1) % imgList.length
    //   let current = children[currentIndex]
    //   let next = children[nextIndex]

    //   next.style.transition = 'none'
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`

    //   setTimeout(() => {
    //     next.style.transition = ''
    //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
    //     next.style.transform = `translateX(${-nextIndex * 100}%)`

    //     currentIndex = nextIndex
    //   }, 16)

    // }, 3000)

    return this.root
  }

  moveTo(parent) {
    parent.appendChild(this.render())
  }
}

