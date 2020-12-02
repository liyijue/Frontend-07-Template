// 0 -> 空  1 -> ⭕  2 -> ❌
const ChessMaps = {
  0: '',
  1: '⭕',
  2: '❌'
}
// 棋盘
let plate = [
  [0, 1, 0],
  [2, 0, 0],
  [1, 0, 2]
]

// 棋子 -> 代表 下一个是 ⭕ 先下
let piece = 2

/**
 *  判断是否 输赢
 * @param {Array} plate 棋盘
 * @param {int} piece => 代表 当前棋子 
 * @param {int} x => 代表 x 轴
 * @param {int} y => 代表 y 轴
 */
const check = (plate, piece, x, y) => {
  let win = null

  // 判断 当前棋子在 x 轴是否获胜
  {
    win = true
    for (let j = 0; j < plate[x].length; j++) {
      if (plate[x][j] !== piece) {
        win = false
        break
      }
    }
    if (win) return true
  }

  // 判断 当前棋子在 y 轴是否获胜
  {
    win = true
    for (let i = 0; i < plate.length; i++) {
      if (plate[i][y] !== piece) {
        win = false
        break
      }
    }
    if (win) return true
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
        if (check(copyplate, piece, i, j)) {
          console.log(`${ChessMaps[piece]} 要赢了!`)
        }
        copyplate[i][j] = 0
      }
    }
  }
}


// 下棋子
const move = (x, y) => {
  if (plate[x][y] !== 0) {
    alert('请勿在已有棋子的位子继续下棋!')
    return
  }
  piece = 3 - piece
  plate[x][y] = piece
  if (check(plate, piece, x, y)) {
    alert(`恭喜 ${ChessMaps[piece]} 获胜了!`)
  }
  show()
  tips(plate, 3 - piece)
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
        move(i, j)
      })
      app.appendChild(chess)
    }
    app.appendChild(document.createElement('br'))
  }
}

window.onload = () => {
  show()
}
