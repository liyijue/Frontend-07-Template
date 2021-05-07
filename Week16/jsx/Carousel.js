import { Component, STATE, ATTRIBUTES } from './framework'
import { enableGesture } from './gesture.js'
import { TimeLine, Animation } from './animation.js'
import { ease } from './ease.js'

export class Carousel extends Component {
  constructor() {
    super()
  }

  render() {
    this.root = document.createElement('div')
    this.root.classList.add('carousel')
    for (const record of this[ATTRIBUTES].src) {
      const div = document.createElement('div')
      div.style.backgroundImage = `url(${record.img})`
      this.root.appendChild(div)
    }

    enableGesture(this.root)
    const timeLine = new TimeLine()

    timeLine.start()

    const children = this.root.children
    this[STATE].position = 0

    let t = 0
    let ax = 0

    let handler = null

    this.root.addEventListener('start', event => {
      timeLine.pause()
      clearInterval(handler)
      let progress = (Date.now() - t) / 1500
      ax = ease(progress) * 500 - 500
    })

    this.root.addEventListener('tap', () => {
      this.triggerEvent('click', {
        herf: this[ATTRIBUTES].src[this[STATE].position].url,
        position: this[STATE].position 
      })
    })

    this.root.addEventListener('pan', event => {
      const x = event.clientX - event.startX - ax
      const current = this[STATE].position - ((x - x % 500) / 500)

      for (const offset of [-1, 0, 1]) {
        const pos = ((current + offset) % children.length + children.length) % children.length

        children[pos].style.transition = 'none'
        children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`
      }
    })

    this.root.addEventListener('end', event => {
      timeLine.reset()
      timeLine.start()
      handler = setInterval(nextPicture, 3000)

      const x = event.clientX - event.startX - ax
      const current = this[STATE].position - ((x - x % 500) / 500)

      let direction = Math.round((x % 500) / 500)

      if (event.isFlick) {
        if (event.velocity < 0) {
          direction = Math.ceil((x % 500) / 500)
        } else {
          direction = Math.floor((x % 500) / 500)
        }
      }

      for (const offset of [-1, 0, 1]) {
        const pos = ((current + offset) % children.length + children.length) % children.length

        children[pos].style.transition = 'none'
        timeLine.add(new Animation(children[pos].style, 'transform',
          -pos * 500 + offset * 500 + x % 500, -pos * 500 + offset * 500 + direction * 500, 500, 0, ease, v => `translateX(${v}px)`))
      }

      this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction
      this[STATE].position = (this[STATE].position % children.length + children.length) % children.length
      this.triggerEvent('change', { position: this[STATE].position })
    })

    const nextPicture = () => {
      let nextIndex = (this[STATE].position + 1) % children.length

      let current = children[this[STATE].position]
      let next = children[nextIndex]

      t = Date.now()

      timeLine.add(new Animation(current.style, 'transform',
        - this[STATE].position * 500, -500 - this[STATE].position * 500, 500, 0, ease, v => `translateX(${v}px)`))
      timeLine.add(new Animation(next.style, 'transform',
        500 - nextIndex * 500, -nextIndex * 500, 500, 0, ease, v => `translateX(${v}px)`))

      this[STATE].position = nextIndex
      this.triggerEvent('change', { position: this[STATE].position })
    }

    handler = setInterval(nextPicture, 3000)

    return this.root
  }
}

