class Animal {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  bite(obj) {
    console.log(`${this.name} 咬 ${obj.name}`)
  }
}

class Person extends Animal {
  constructor(name, age, language) {
    super(name, age)
    this.language = language
  }

  speak() {
    console.log(`${this.name}在说话`)
  }
}

class Dog extends Animal {
  constructor(name, age, color) {
    super(name, age)
    this.color = color
  }
}

const person = new Person('xiaohong', 20, '中文')
const dog = new Dog('huanhuan', 2, '灰色')

dog.bite(person)
