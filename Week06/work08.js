class MyBuffer {
  buffer = []

  constructor(string) {
    for (let i = 0; i < string.length; i++) {
      this.buffer.push(string[i].charCodeAt())
    }
  }
}

function UTF8_Encodeing(string) {
  return new MyBuffer(string).buffer
}

console.log(UTF8_Encodeing('123'))