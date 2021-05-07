import { TimeLine, Animation } from './animation.js'
import { easeOut } from './ease.js'

const timeLine = new TimeLine()


timeLine.add(new Animation(document.querySelector('#el').style, 'transform', 0, 500, 2000, 0, easeOut, v => `translateX(${v}px)`))

timeLine.start()

document.querySelector('#e2').style.transition = `transform ease-out 2s`
document.querySelector('#e2').style.transform = `translateX(500px)`

document.querySelector('#pause-btn').addEventListener('click', () => {
  timeLine.pause()
})

document.querySelector('#resume-btn').addEventListener('click', () => {
  timeLine.resume()
})
