const clearLight = () => {
  const divList = document.querySelector('.light')
  divList?.classList?.remove('light')
}

const greenLight = () => {
  clearLight()
  const greenDiv = document.querySelector('.green')
  greenDiv.classList.add('light')
}

const yellowLight = () => {
  clearLight()
  const yellowDiv = document.querySelector('.yellow')
  yellowDiv.classList.add('light')
}

const redLight = () => {
  clearLight()
  const redDiv = document.querySelector('.red')
  redDiv.classList.add('light')
}

const sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

const go = async () => {
  greenLight()
  await sleep(1000)
  yellowLight()
  await sleep(200)
  redLight()
  await sleep(500)
  go()
}

window.onload = () => {
  go()
}
