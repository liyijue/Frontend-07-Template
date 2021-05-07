// document.body.appendChild(a)
import { createElement } from './framework'
import { Carousel } from './Carousel'
import { Button } from './Button'
import { List } from './List'
import { TimeLine, Animation } from './animation'

const timeLine = new TimeLine()

window.timeLine = timeLine
window.Animation = new Animation({}, 'animation', 0, 100, 1000, null)

timeLine.add(new Animation({}, 'animation', 0, 100, 1000, null))
// timeLine.start()

const imgList = [
  {
    img: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
    url: 'https://www.baidu.com/',
    title: 'xxx'
  },
  {
    img: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    url: 'https://www.baidu.com/',
    title: 'xxx'
  },
  {
    img: 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
    url: 'https://www.baidu.com/',
    title: 'xxx'
  },
  {
    img: 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
    url: 'https://www.baidu.com/',
    title: 'xxx'
  }
]

// const a = <Carousel
//   src={imgList}
//   onChange={event => console.log(event.detail.position)}
//   onClick={event => window.open(event.detail.herf)} />

const b = <List data={imgList}>
  {
    (record) => (
      <div>
        <img src={record.img}></img>
        <a href={record.url}>{record.title}</a>
      </div>
    )
  }
</List>

b.moveTo(document.body)
