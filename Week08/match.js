let state = start

function match(string) {
  for (const c of string) {
    state = state(c)
  }

  return state === end
}

// abababx

console.log(match('abababcababaaaabababxcccab'))

function start(c) {
  if (c === 'a')
    return findB
  else
    return start
}

function findB(c) {
  if (c === 'b')
    return findA2
  else
    return start(c)
}

function findA2(c) {
  if (c === 'a')
    return findB2
  else
    return start(c)
}

function findB2(c) {
  if (c === 'b')
    return findA3
  else
    return start(c)
}

function findA3(c) {
  if (c === 'a')
    return findB3
  else
    return start(c)
}

function findB3(c) {
  if (c === 'b')
    return findX
  else
    return start(c)
}

function findX(c) {
  if (c === 'x')
    return end
  else
    return start(c)
}

function end(c) {
  if (c)
    return end
}

