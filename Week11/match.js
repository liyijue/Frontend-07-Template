const SelectorMaps = ['>', ' ', '+', '~']

// 获取所有节点
function fetchSelector(str) {
  let arr = []
  let string = ''

  for (let i = 0; i < str.length; i++) {
    if (SelectorMaps.includes(str[i])) {
      arr.push(string)
      string = ''
    } else {
      string += str[i]
    }
  }
  arr.push(string)

  return arr
}

// 获取自己后面全部兄弟节点
function findSibling(tag) {
  let parentEl = tag.parentNode;
  let childs = parentEl.children;
  let siblings = [];
  let flag = false
  for (let i = 0; i <= childs.length - 1; i++) {
    if (childs[i] === tag) {
      flag = true
      continue
    }
    if (!flag) continue
    if (childs[i].tagName === 'SCRIPT') {
      continue;
    }
    siblings[siblings.length] = childs[i];
  }
  return siblings;
};

let currentElemet = null
let onlyChild = false


function selectChild(element, str) {

}

function slectChildren(str) {
  for (let i = 0; i < currentElemet.children.length; i++) {
    if (str.includes('#')) {
      // TODO
    }
  }
}

function selectBrother(element, str) {

}

function selectAllBrother(element, str) {

}


// 进行匹配
function match(selector, element) {
  currentElemet = element
  const SelectorFun = {
    '>': selectChild,
    ' ': slectChildren,
    '+': selectBrother,
    '~': selectAllBrother
  }
  const selectorArr = fetchSelector(selector)
  let currentIndex = 0

  for (let i = 0; i < selector.length; i++) {
    if (SelectorMaps.includes(selector[i])) {
      if (!SelectorFun[selector[i]](selectorArr[++currentIndex])) return false
    }
  }
  return true
}


console.log(match("div #id.class", document.querySelector('div')))
