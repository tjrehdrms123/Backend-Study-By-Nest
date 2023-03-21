# SOLID 원칙 객체지향

### SOLID의 원칙이란?
> SOLID 원칙들은 소프트웨어 작업에서 프로그래머가 소스 코드가 읽기 쉽고 확장하기 쉽게 될 때까지 소프트웨어 소스 코드를 리팩터링하여 코드 스멜을 제거하기 위해 적용할 수 있는 지침이다.

## `O OCP`
개방 폐쇄 원칙 (Open Closed Principle)
소프트웨어 개체는 확장에 대해 열려 있어야 하고, 수정에 대해서는 닫혀 있어야 한다.
> "확장에는 열려 있다"는 말은 기존 기능에 새로운 기능을 확장하기 쉬워야 한다는 의미입니다
> "수정에 대해서는 닫혀 있다"는 말은 새로운 기능을 확장하면서 기존의 코드에는 변화가 없어야 한다는 의미입니다

> OCP를 가장 잘 이해할 수 있는 예시는 `프레임워크`, `라이브러리`라고 생각이 된다. 왜냐하면 보통 NPM과 같은 패키지 매니저로 설치하게되면 설치한 패키지는 건들지 않고 확장해서 사용하기 떄문이다.

## OCP 적용 전 예제
```js
class Animal{
  constructor(type) {
    this.type = type;
  }
  speak(){
    if(this.type === "cat"){
      console.log("냐용");
    } else if(this.type === "dog"){
      console.log("왈왈");
    } else {
      throw new Error("정의되지 않은 동물입니다.");
    }
  }
}
cat = new Animal();
cat.type = "cat";
cat.speak();
```

## `chicken` 타입이 추가됐을떄
해당 사례는 `OCP`원칙을 를 위반한 사례입니다.
만약 `chicken` 타입이 추가됐을떄 구현부 코드가 아래와 같이 변경될 것 입니다.

```js
if(this.type === "cat"){
    console.log("냐용");
  } else if(this.type === "dog"){
    console.log("왈왈");
  } else if (this.type === "chicken"){
    console.log("꼬끼온");
  } else {
    throw new Error("정의되지 않은 동물입니다.");
  }
```

## OCP 적용 후 예제
추상화를 생각하면서 구현부의 코드를 추상화했습니다.
기존 기능은 수정하지 않아도 새로운 기능을 확장할 수 있어졌습니다.

```ts
abstract class Animal{
  abstract speak(): void;
}

class Cat extends Animal{
    speak(){
        console.log("야옹");
    }
}

class Chicken extends Animal{
    speak(){
        console.log("꼬끼오");
    }
}

let cat = new Cat();
cat.speak();

let chicken = new Chicken();
chicken.speak();
```