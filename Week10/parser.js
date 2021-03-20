const css = require('css')
const layout = require('./layout.js')

// 结束标记 End of File
const EOF = Symbol('EOF')
let currentToken = null
let currentAttribute = null
let currentTextNode = null
let stack = [{ type: 'document', children: [] }]

const rules = []
function addCssRules(text) {
  let ast = css.parse(text)
  // console.log(JSON.stringify(ast, null, '    '))
  rules.push(...ast.stylesheet.rules)
}

function match(element, selector) {
  if (!selector || !element.attributes)
    return false

  if (selector.charAt(0) === '#') {
    const attr = element.attributes.filter(attr => attr.name === 'id')[0]
    if (attr && attr.value === selector.replace('#', ''))
      return true
  } else if (selector.charAt(0) === '.') {
    const attr = element.attributes.filter(attr => attr.name === 'calss')[0]
    if (attr && attr.value === selector.replace('.', ''))
      return true
  } else {
    if (element.tagName === selector)
      return true
  }

  return false
}

function specificity(selector) {
  const p = [0, 0, 0, 0]
  const selectorParts = selector.split(' ')
  for (const part of selectorParts) {
    if (part.charAt(0) === '#') {
      p[1] += 1
    } else if (part.charAt(0) === '.') {
      p[2] += 1
    } else {
      p[3] += 1
    }
  }

  return p
}

function compare(sp1, sp2) {
  if (sp1[0] - sp1[0]) {
    return sp1[0] - sp1[0]
  } else if (sp1[1] - sp1[1]) {
    return sp1[1] - sp1[1]
  } else if (sp1[2] - sp1[2]) {
    return sp1[2] - sp1[2]
  }

  return sp1[3] - sp2[3]
}

function computeCss(element) {
  const elements = stack.slice().reverse()

  if (!element.computedStyle)
    element.computedStyle = {}

  for (const rule of rules) {
    const selectorParts = rule.selectors[0].split(' ').reverse()
    // 当 第一个元素都匹配不到就直接跳过
    if (!match(element, selectorParts[0])) {
      continue
    }

    let matched = false

    let j = 1
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++
      }
    }
    if (j >= selectorParts.length) {
      matched = true
    }
    if (matched) {
      // 代表匹配成功
      const sp = specificity(rule.selectors[0])
      const computedStyle = element.computedStyle
      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }

        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        } else if (compare(sp, computedStyle[declaration.property].specificity) > 0) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        }
      }
      // console.log(element.computedStyle)
    }
  }
}

function emit(token) {
  let top = stack[stack.length - 1]

  if (token.type === 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    }

    element.tagName = token.tagName

    for (const p in token) {
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }

    computeCss(element)

    top.children.push(element)
    element.patent = top

    if (!token.isSelfClosing)
      stack.push(element)

    currentTextNode = null
  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error("Tag start end doesn't mathch!")
    } else {
      if (top.tagName === 'style') {
        addCssRules(top.children[0].content)
      }
      layout(top)
      stack.pop()
    }
    currentTextNode = null
  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: ''
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}


// 初始状态
function data(char) {
  if (char == '<') {
    return tagOpen
  } else if (char === EOF) {
    emit({
      type: 'EOF'
    })
    return
  } else {
    emit({
      type: 'text',
      content: char
    })
    return data
  }
}

function tagOpen(char) {
  if (char === '/') {
    return endTagOpen
  } else if (char.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'startTag',
      tagName: char
    }
    return tagName
  } else {
    return
  }
}

function endTagOpen(char) {
  if (char.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: 'endTag',
      tagName: char
    }
    return tagName
  } else if (char === '>') {

  } else if (char === EOF) {

  } else {

  }
}

function tagName(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (char === '/') {
    return selfClosingStartTag
  } else if (char.match(/^[a-zA-Z]$/)) {
    currentToken.tagName += char
    return tagName
  } else if (char === '>') {
    emit(currentToken)
    return data
  } else {
    return tagName
  }
}

function beforeAttributeName(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName
  } else if (char === '>' || char === '/' || char === EOF) {
    return afterAttributeName(char)
  } else if (char === '=') {

  } else {
    currentAttribute = {
      name: '',
      value: ''
    }
    return attributeName(char)
  }
}

function attributeName(char) {
  if (char.match(/^[/t/n/f ]$/) || char === '/' || char === '>' || char === EOF) {
    return afterAttributeName(char)
  } else if (char === '=') {
    return beforeAttributeValue
  } else if (char === '\u0000') {

  } else if (char === '\"' || char === "'" || char === '<') {

  } else {
    currentAttribute.name += char
    return attributeName
  }
}

function afterAttributeName(char) {
  return data(char)
}

function beforeAttributeValue(char) {
  if (char.match(/^[\t\n\f ]$/) || char === '>' || char === EOF) {
    emit(currentToken)
    return data
  } else if (char === '/') {
    return tagName(char)
  } else if (char === '\"') {
    return doubleQuotedAttributeValue
  } else if (char == '\'') {
    return singleQuotedAttributeValue
  } else if (char === '>') {

  } else {
    return UnquotedAttributeValue(char)
  }
}

function doubleQuotedAttributeValue(char) {
  if (char === '\"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeName
  } else if (char === '\u0000') {

  } else if (char === EOF) {

  } else {
    currentAttribute.value += char
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(char) {
  if (char === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeName
  } else if (char === '\u0000') {

  } else if (char === EOF) {

  } else {
    currentAttribute.value += char
    return doubleQuotedAttributeValue
  }
}

function UnquotedAttributeValue(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeValue
  } else if (char === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (char === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (char === '\u0000') {

  } else if (char === '\"' || char === "'" || char === '<' || char === '=' || char === '`') {

  } else if (char === EOF) {

  } else {
    currentAttribute.value += char
    return UnquotedAttributeValue
  }
}

function afterQuotedAttributeName(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeValue
  } else if (char === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (char === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (char === '\u0000') {

  } else if (char === EOF) {

  } else {
    currentAttribute.value += char
    return UnquotedAttributeValue
  }
}

function selfClosingStartTag(char) {
  if (char === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (char === EOF) {

  } else {

  }
}

parser = {
  parseHTML(html) {
    let state = data

    for (const char of html) {
      state = state(char)
    }
    state(EOF)

    return stack[0]
  }
}

module.exports = parser
