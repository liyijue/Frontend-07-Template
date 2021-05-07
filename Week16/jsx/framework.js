export function createElement(type, attributes, ...children) {
  let element = null

  if (typeof type === 'string') {
    element = new ElementWrapper(type)
  } else {
    element = new type()
  }

  for (const attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute])
  }

  let processChildren = (children) => {
    for (let child of children) {
      if (typeof child === 'function' && child instanceof Function) {
        continue
      }

      if (typeof child === 'object' && child instanceof Array) {
        processChildren(child)
        continue
      }

      if (typeof child === 'string') {
        child = new TextWrapper(child)
      }
      child.moveTo(element)
    }
  }

  processChildren(children)

  return element
}

export const STATE = Symbol('state')
export const ATTRIBUTES = Symbol('attributes')

export class Component {
  constructor(type) {
    this[ATTRIBUTES] = Object.create(null)
    this[STATE] = Object.create(null)
  }

  render() {
    return this.root
  }

  setAttribute(name, value) {
    this[ATTRIBUTES][name] = value
  }

  appendChild(child) {
    this.root.appendChild(child)
  }

  moveTo(parent) {
    if (!this.root) {
      this.render()
    }
    parent.appendChild(this.root)
  }

  triggerEvent(type, args) {
    this[ATTRIBUTES]['on' + type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, { detail: args }))
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    super()
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
}

class TextWrapper extends Component {
  constructor(content) {
    super()
    this.root = document.createTextNode(content)
  }
}
