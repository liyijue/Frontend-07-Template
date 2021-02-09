function StringToNumber(string) {
  return Number(string).valueOf()
}

function NumberToString(number) {
  return number + ''
}

console.log(StringToNumber('123'))
console.log(NumberToString(123))
