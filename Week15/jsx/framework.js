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

  for (let child of children) {
    if (typeof child === 'string') {
      child = new TextWrapper(child)
    }
    child.moveTo(element)
  }

  return element
}

export class Component {
  constructor(type) {
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }

  appendChild(child) {
    this.root.appendChild(child)
  }

  moveTo(parent) {
    parent.appendChild(this.root)
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    this.root = document.createElement(type)
  }
}

class TextWrapper extends Component {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
}
