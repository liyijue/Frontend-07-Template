let element = document.documentElement


export class Dispatcher {
  constructor(element) {
    this.element = element
  }

  dispatch(type, properties) {
    const event = new Event(type)
    for (const name in properties) {
      event[name] = properties[name]
    }
    this.element.dispatchEvent(event)
  }
}


class Listener {
  constructor(element, recognizer) {
    this.isListeningMouse = false
    const contents = new Map()

    element.addEventListener('mousedown', (event) => {
      const content = Object.create(null)
      contents.set('mouse' + (1 << event.button), content)

      recognizer.start(event, content)
      const mouseMove = (event) => {
        let button = 1
        while (button <= event.buttons) {
          if (button & event.buttons) {
            let key

            if (button === 2) {
              key = 4
            } else if (button === 4) {
              key = 2
            } else {
              key = button
            }

            const content = contents.get('mouse' + key)
            recognizer.move(event, content)
          }
          button = button << 1
        }
      }
      const mouseUp = (event) => {
        let content = contents.get('mouse' + (1 << event.button))
        recognizer.end(event, content)
        contents.delete('mouse' + (1 << event.button))

        if (event.buttons === 0) {
          document.removeEventListener('mousemove', mouseMove)
          document.removeEventListener('mouseup', mouseUp)
          this.isListeningMouse = false
        }
      }

      if (!this.isListeningMouse) {
        document.addEventListener('mousemove', mouseMove)
        document.addEventListener('mouseup', mouseUp)
        this.isListeningMouse = true
      }
    })

    element.addEventListener('touchstart', event => {
      for (const touch of event.changedTouches) {
        const content = Object.create(null)
        contents.set(touch.identifier, content)
        recognizer.start(touch, content)
      }
    })

    element.addEventListener('touchmove', event => {
      for (const touch of event.changedTouches) {
        const content = contents.get(touch.identifier)
        recognizer.move(touch, content)
      }
    })

    element.addEventListener('touchend', event => {
      for (const touch of event.changedTouches) {
        const content = contents.get(touch.identifier)
        recognizer.end(touch, content)
        contents.delete(touch.identifier)
      }
    })

    element.addEventListener('touchcancel', event => {
      for (const touch of event.changedTouches) {
        const content = contents.get(touch.identifier)
        recognizer.cancel(touch, content)
        contents.delete(touch.identifier)
      }
    })
  }
}

class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher
  }
  start(point, content) {
    content.startX = point.clientX
    content.startY = point.clientY

    this.dispatcher.dispatch('start', {
      startX: content.startX,
      startY: content.startY
    })

    content.isTap = true
    content.isPan = false
    content.isPress = false
    content.points = [
      {
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
      }
    ]

    content.handle = setTimeout(() => {
      content.isTap = false
      content.isPan = false
      content.isPress = true
      content.handle = null
      this.dispatcher.dispatch('press', {})
    }, 500)
  }

  move(point, content) {
    const mx = point.clientX - content.startX
    const my = point.clientY - content.startY

    content.points = content.points.filter(p => Date.now() - p.t < 500)
    if (!content.isPan && mx ** 2 + my ** 2 > 100) {
      content.isTap = false
      content.isPan = true
      content.isPress = false
      content.isVertical = Math.abs(mx) < Math.abs(my)
      this.dispatcher.dispatch("panstart", {
        startX: content.startX,
        startY: content.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: content.isVertical
      })
      clearTimeout(content.handle)
    }
    if (content.isPan) {
      this.dispatcher.dispatch("pan", {
        startX: content.startX,
        startY: content.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: content.isVertical
      })
    }

    content.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    })
  }

  end(point, content) {
    let d, v
    if (!content.points.length) {
      v = 0
    } else {
      d = Math.sqrt((point.clientX - content.points[0].x) ** 2 +
        (point.clientY - content.points[0].y) ** 2)
      v = d / (Date.now() - content.points[0].t)
    }

    content.points = content.points.filter(p => Date.now() - p.t < 500)


    if (v > 1.5) {
      content.isFlick = true
      this.dispatcher.dispatch("flick", {
        startX: content.startX,
        startY: content.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: content.isVertical,
        isFlick: content.isFlick,
        velocity: v
      })
    } else {
      content.isFlick = false
    }

    if (content.isTap) {
      this.dispatcher.dispatch('tap', {})
      clearTimeout(content.handle)
    }

    if (content.isPan) {
      this.dispatcher.dispatch("panend", {
        startX: content.startX,
        startY: content.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isFlick: content.isFlick,
        isVertical: content.isVertical,
        velocity: v
      })
    }

    if (content.isPress) {
      this.dispatcher.dispatch("pressend", {})
    }

    this.dispatcher.dispatch("end", {
      startX: content.startX,
      startY: content.startY,
      clientX: point.clientX,
      clientY: point.clientY,
      isFlick: content.isFlick,
      isVertical: content.isVertical,
      velocity: v
    })
  }

  cancel(point, content) {
    clearTimeout(content.handle)
    this.dispatcher.dispatch("cancel", {})
  }
}

export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)))
}




/**
 * 
 * 
 * 
 * 
 */

window.addEventListener('contextmenu', event => {
  event.preventDefault()
})