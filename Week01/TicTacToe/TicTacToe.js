// 0 -> 空  1 -> ⭕  2 -> ❌
const ChessMaps = {
  0: '',
  1: '⭕',
  2: '❌'
}
// 棋盘
let plate = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]

// 棋子 -> 代表 下一个是 ⭕ 先下
let piece = 1

/**
 *  判断是否 输赢
 * @param {Array} plate 棋盘
 * @param {int} piece => 代表 当前棋子 
 * @param {int} x => 代表 x 轴
 * @param {int} y => 代表 y 轴
 */
const check = (plate, piece) => {
  let win = null

  // 判断 当前棋子在 x 轴是否获胜
  {
    win = true
    for (let i = 0; i < plate.length; i++) {
      win = true
      for (let j = 0; j < plate[i].length; j++) {
        if (plate[i][j] !== piece) {
          win = false
          break
        }
      }
      if (win) return true
    }
  }

  // 判断 当前棋子在 y 轴是否获胜
  {
    win = true
    for (let i = 0; i < plate.length; i++) {
      win = true
      for (let j = 0; j < plate[i].length; j++) {
        if (plate[j][i] !== piece) {
          win = false
          break
        }
      }
      if (win) return true
    }
  }

  // 判断 当前棋子正斜 是否获胜
  {
    win = true
    for (let i = 0; i < plate.length; i++) {
      if (plate[i][i] !== piece) {
        win = false
        break
      }
    }
    if (win) return true
  }

  // 判断 当前棋子反斜 是否获胜
  {
    win = true
    for (let i = 0; i < plate.length; i++) {
      if (plate[i][plate.length - i - 1] !== piece) {
        win = false
        break
      }
    }
    if (win) return true
  }

  return false
}

/**
 * 提示 棋子是否快赢了
 * @param {Array} plate 棋盘
 * @param {int} piece 棋子
 */
const tips = (plate, piece) => {
  const copyplate = JSON.parse(JSON.stringify(plate))
  for (let i = 0; i < copyplate.length; i++) {
    for (let j = 0; j < copyplate[i].length; j++) {
      if (plate[i][j] === 0) {
        copyplate[i][j] = piece
        if (check(copyplate, piece)) {
          return [i, j]
        }
        copyplate[i][j] = 0
      }
    }
  }
  return null
}

/**
 * 提示这局是否可以赢 1 代表 赢 0代表平
 * @param {Array} plate 棋盘
 * @param {int} piece 棋子
 */

const bestAI = (plate, piece) => {
  let p = null
  // 如果可以赢就不需要向下走进行递归了
  if (p = tips(plate, piece)) {
    return {
      point: p,
      result: 1
    }
  }
  // 如果 还不可以赢就继续判断找出对方最差点
  let result = -2
  let point = null
  for (let i = 0; i < plate.length; i++) {
    for (let j = 0; j < plate[i].length; j++) {
      const tmp = JSON.parse(JSON.stringify(plate))
      if (plate[i][j] === 0) {
        tmp[i][j] = piece
        r = bestAI(tmp, 3 - piece).result
        if (-r > result) {
          result = -r
          point = [i, j]
        }
      }
    }
  }
  return {
    point,
    result: point ? result : 0
  }
}

// 模拟电脑自动下棋
const computerMove = () => {
  const data = bestAI(plate, piece)
  if (data.point) {
    piece = 3 - piece
    plate[data.point[0]][data.point[1]] = piece
  }
  console.log(plate)
  if (check(plate, piece)) {
    alert(`恭喜 ${ChessMaps[piece]} 获胜了!`)
  }
  show()
}


// 下棋子
const useMove = (x, y) => {
  if (plate[x][y] !== 0) {
    alert('请勿在已有棋子的位子继续下棋!')
    return
  }
  piece = 3 - piece
  plate[x][y] = piece
  if (check(plate, piece)) {
    alert(`恭喜 ${ChessMaps[piece]} 获胜了!`)
  }
  console.log(bestAI(plate, piece))
  show()
  if (tips(plate, 3 - piece)) {
    console.log(`${ChessMaps[3 - piece]} 要赢了!`)
  }
  computerMove()
}

// 渲染棋盘
const show = () => {
  const app = document.querySelector('#app')
  app.innerHTML = ''
  for (let i = 0; i < plate.length; i++) {
    for (let j = 0; j < plate[i].length; j++) {
      const chess = document.createElement('div')
      chess.classList.add('chess_item')
      chess.innerText = ChessMaps[plate[i][j]]
      chess.addEventListener('click', () => {
        useMove(i, j)
      })
      app.appendChild(chess)
    }
    app.appendChild(document.createElement('br'))
  }
}

window.onload = () => {
  show()
}
