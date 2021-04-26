const TICK = Symbol('TICK')
const TICK_HANDLER = Symbol('TICK_HANDLER')
const ANIMATION_LIST = Symbol('ANIMATION_LIST')
const START_TIME = Symbol('START_TIME')
const PAUSE_START_TIME = Symbol('PAUSE_START_TIME')
const PAUSE_TIME = Symbol('PAUSE_TIME')

export class TimeLine {
  constructor() {
    this.state = 'inited'
    this[ANIMATION_LIST] = new Set()
    this[START_TIME] = new Map()
  }

  start() {
    if (this.state !== 'inited') {
      return
    }
    this.state = 'started'
    const startTime = Date.now()
    this[PAUSE_TIME] = 0

    this[TICK] = () => {
      const now = Date.now()
      for (const animation of this[ANIMATION_LIST]) {
        let t = undefined

        if (this[START_TIME].get(animation) < startTime) {
          t = now - startTime - this[PAUSE_TIME] - animation.delay
        } else {
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay
        }

        if (t > animation.duration) {
          this[ANIMATION_LIST].delete(animation)
          t = animation.duration
        }

        if (t > 0) {
          animation.receive(t)
        }
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
    }
    this[TICK]()
  }

  pause() {
    if (this.state !== 'started') {
      return
    }

    this.state = 'paused'
    this[PAUSE_START_TIME] = Date.now()
    cancelAnimationFrame(this[TICK_HANDLER])
  }

  resume() {
    if (this.state !== 'paused') {
      return
    }

    this.state = 'started'
    this[PAUSE_TIME] = this[PAUSE_TIME] + Date.now() - this[PAUSE_START_TIME]
    this[TICK]()
  }

  reset() {
    this.pause()
    let staretTime = 0
    this.state = 'inited'
    this[PAUSE_START_TIME] = 0
    this[START_TIME] = new Map()
    this[PAUSE_TIME] = 0
    this[TICK_HANDLER] = null
  }

  add(animation, startTime) {
    this[ANIMATION_LIST].add(animation)
    if (arguments.length < 2) {
      startTime = Date.now()
    }
    this[START_TIME].set(animation, startTime)
  }
}

export class Animation {
  constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
    this.object = object
    this.property = property
    this.startValue = startValue
    this.endValue = endValue
    this.duration = duration
    this.delay = delay
    this.timingFunction = timingFunction || (v => v)
    this.template = template || (v => v)
  }

  receive(time) {
    const range = this.endValue - this.startValue
    const progress = this.timingFunction(time / this.duration)

    this.object[this.property] = this.template(this.startValue + range * progress)
  }
}
