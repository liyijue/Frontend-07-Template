import { ATTRIBUTES, Component, createElement } from './framework.js'

export class List extends Component {
  constructor() {
    super()
  }

  render() {
    this.children = this[ATTRIBUTES].data.map((record) => (
      <div>
        <img src={record.img}></img>
        <a href={record.url}>{record.title}</a>
      </div>
    ));
    this.root = (<div>{this.children}</div>).render()
    return this.root
  }

  appendChild(child) {
    this.template = (child)
    // render()
  }
}