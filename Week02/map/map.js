let clear = false
let draw = false

const map = document.querySelector('#app')
// 初始事件
document.addEventListener('contextmenu', e => e.preventDefault())
document.addEventListener('mousedown', e => {
  if (e.which === 3) {
    draw = false
    clear = true
  } else if (e.which === 2) {
    clear = false
    draw = false
  } else {
    clear = false
    draw = true
  }
})

const originList = JSON.parse(localStorage.getItem('map')) ?? new Array(10000).fill(0)
const mapList = Object.create(originList)

// 延迟方法
const sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

const initMap = () => {
  map.innerHTML = ''

  const handleMouseMove = (e, x, y) => {
    if (draw) {
      mapList[x * 100 + y] = 1
      e.target.style.backgroundColor = '#333'
    }
    if (clear) {
      mapList[x * 100 + y] = 0
      e.target.style.backgroundColor = 'gray'
    }
  }

  for (let x = 0; x < 100; x++) {
    const divList = document.createElement('div')
    divList.classList.add('map_list')
    for (let y = 0; y < 100; y++) {
      const divItem = document.createElement('div')
      divItem.classList.add('map_item')
      divItem.addEventListener('mouseenter', e => handleMouseMove(e, x, y))
      if (mapList[x * 100 + y] === 1) {
        divItem.style.backgroundColor = '#333'
      }
      divList.appendChild(divItem)
    }
    map.appendChild(divList)
  }

  // 保存地图
  const buttonSave = document.createElement('button')
  buttonSave.innerText = '保存地图'
  buttonSave.addEventListener('click', () => {
    localStorage.setItem('map', JSON.stringify(mapList))
    draw = false
    clear = false
  })
  map.appendChild(buttonSave)
  // 清空全部绘画
  const buttonClear = document.createElement('button')
  buttonClear.innerText = '清空所有'
  buttonClear.addEventListener('click', () => {
    const map = new Array(10000).fill(0)
    localStorage.setItem('map', JSON.stringify(map))
    draw = false
    clear = false
    initMap()
  })
  map.appendChild(buttonClear)
}

// 启发式搜索 -》 数据结构
class Stored {
  constructor(data, compted) {
    this.data = data ?? []
    this.compted = compted ?? ((a, b) => a - b)
  }

  task() {
    let min = undefined
    let minIndex = -1

    for (let i = 0; i < this.data.length; i++) {
      if (min === undefined || this.compted(min, this.data[i]) > 0) {
        min = this.data[i]
        minIndex = i
      }
    }

    this.data[minIndex] = this.data[this.data.length - 1]
    this.data.pop()

    return min
  }

  give(v) {
    this.data.push(v)
  }
}

// 将有可能的点加入队列
const insertQueue = async (queue, current, pre) => {
  if (current[0] > 99 || current[0] < 0 || current[1] > 99 || current[1] < 0) return
  if (mapList[100 * current[0] + current[1]]) return
  mapList[100 * current[0] + current[1]] = pre
  queue.give([current[0], current[1]])
}

// 查找 起始点到结束点的路径
const findStartToEnd = async (start, end) => {
  try {
    const endDivList = map.children[end[0]]
    const endDiv = endDivList.children[end[1]]
    endDiv.style.backgroundColor = 'red';

    const contrast = (spot) => {
      return ((end[0] - spot[0]) ** 2) + ((end[1] - spot[1]) ** 2)
    }

    const queue = new Stored([start], (a, b) => (contrast(a) - contrast(b)))
    while (queue.data.length) {
      const current = queue.task()
      const divList = map.children[current[0]]
      const div = divList.children[current[1]]
      await sleep(30)
      div.style.backgroundColor = 'pink'
      if (current[0] === end[0] && current[1] === end[1]) {
        let path = []
        let [x, y] = current

        while (x !== start[0] || y !== start[1]) {
          path.push([x, y])
          const divList = map.children[x]
          const div = divList.children[y]
          await sleep(30)
          div.style.backgroundColor = 'green';
          [x, y] = mapList[x * 100 + y]
        }

        // 最初得点
        const divList = map.children[x]
        const div = divList.children[y]
        div.style.backgroundColor = 'green';
        return path
      }

      // 上下左右
      insertQueue(queue, [current[0] - 1, current[1]], current)
      insertQueue(queue, [current[0] + 1, current[1]], current)
      insertQueue(queue, [current[0], current[1] - 1], current)
      insertQueue(queue, [current[0], current[1] + 1], current)

      // 两斜角
      insertQueue(queue, [current[0] - 1, current[1] - 1], current)
      insertQueue(queue, [current[0] + 1, current[1] + 1], current)
      insertQueue(queue, [current[0] - 1, current[1] + 1], current)
      insertQueue(queue, [current[0] + 1, current[1] - 1], current)
    }

    return null
  } catch (error) {
    console.log(error)
  }
}

// 初次绘画地图
initMap()
