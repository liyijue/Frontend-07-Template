// 棋子的映射  1 - > 白棋  2 -> 黑棋
const ChessMaps = {
  0: '',
  1: '⚪',
  2: '⚫'
}

// 棋盘
let checkerBoard = []
// 棋子 -> 黑棋先下
let chess = 2
// 游戏是否结束
let flag = false

// 初始化 棋盘 15 * 15
const initCheckerBoard = () => {
  for (let i = 0; i < 15; i++) {
    checkerBoard[i] = new Array(10)
    for (let j = 0; j < 15; j++) {
      checkerBoard[i][j] = 0
    }
  }
}

// 代表棋子是否五连了代表赢了游戏
const check = (x, y) => {
  let win = true
  // x轴
  {
    win = true
    for (let i = y; i < y + 5; i++) {
      if (checkerBoard[x][i] !== chess) {
        win = false
        break
      }
    }
    if (win) {
      return true
    }
  }
  // y轴
  {
    win = true
    for (let i = x; i < x + 5; i++) {
      if (checkerBoard[i][y] !== chess) {
        win = false
        break
      }
    }
    if (win) {
      return true
    }
  }
  // 正斜
  {
    win = true
    for (let i = x, j = y; i < x + 5 && j < y + 5; i++, j++) {
      if (checkerBoard[i][j] !== chess) {
        win = false
        break
      }
    }
    if (win) {
      return true
    }
  }
  // 反斜
  {
    win = true
    for (let i = x, j = y; i < x + 5 && j > y - 5; i++, j--) {
      if (checkerBoard[i][j] !== chess) {
        win = false
        break
      }
    }
    if (win) {
      return true
    }
  }
  return false
}

// 检测 哪方获胜
const checkGame = () => {
  for (let i = 0; i < checkerBoard.length; i++) {
    for (let j = 0; j < checkerBoard[i].length; j++) {
      if (checkerBoard[i][j] === chess) {
        if (check(i, j)) {
          return true
        }
      }
    }
  }
  return false
}

// 下棋
const move = (x, y) => {
  if (flag) {
    alert('游戏结束，继续玩请刷新!')
    return
  }
  if (checkerBoard[x][y]) {
    alert('请勿在已有棋子的格子中下棋!')
    return
  }
  checkerBoard[x][y] = chess
  if (checkGame()) {
    alert(`${ChessMaps[chess]}获胜! 游戏结束，继续玩请刷新!`)
    flag = true
  }
  chess = 3 - chess
  show()
}

// 绘画棋盘
const show = () => {
  const app = document.querySelector('#app')
  app.innerHTML = ''
  for (let i = 0; i < checkerBoard.length; i++) {
    for (let j = 0; j < checkerBoard[i].length; j++) {
      const chess = document.createElement('div')
      chess.innerText = ChessMaps[checkerBoard[i][j]]
      chess.addEventListener('click', () => move(i, j))
      chess.classList.add('chess_item')
      app.appendChild(chess)
    }
    app.appendChild(document.createElement('br'))
  }
}

window.onload = () => {
  initCheckerBoard()
  show()
}
