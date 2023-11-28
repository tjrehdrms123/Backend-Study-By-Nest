# Array.prototype.reduce()

reduce() 메서드는 배열의 각 요소에 대해 주어진 리듀서 (reducer) 함수를 실행하고, `하나의 결과값`을 반환합니다.

### 구문
```js
arr.reduce(callback[, initialValue])
```

### 매개변수
- callback
배열의 각 요소에 대해 실행할 함수. 다음 네 가지 인수를 받습니다.

  - accumulator
  누산기는 콜백의 반환값을 누적합니다. 콜백의 이전 반환값 또는, 콜백의 첫 번째 호출이면서 initialValue를 제공한 경우에는 initialValue의 값입니다.

  - currentValue
  처리할 현재 요소.

  - currentIndex `Optional`
  처리할 현재 요소의 인덱스. initialValue를 제공한 경우 0, 아니면 1부터 시작합니다.

  - array `Optional`
  reduce()를 호출한 배열.

- initialValue `Optional`
callback의 최초 호출에서 첫 번째 인수에 제공하는 값. 초기값을 제공하지 않으면 배열의 첫 번째 요소를 사용합니다. 빈 배열에서 초기값 없이 reduce()를 호출하면 오류가 발생합니다.

### 반환 값

누적 계산의 결과 값.

### 예시
```js
const array1 = [1, 2, 3, 4];

// 0 + 1 + 2 + 3 + 4
const initialValue = 0;
const sumWithInitial = array1.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  initialValue,
);

console.log(sumWithInitial);
// Expected output: 10
```

### 폴리필
- [Reduce 폴리필](./reduce_polyfills.js)

### 예제
- [reduce_example.js](./reduce_example.js)

### 참고
- [MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [Medium](https://dongmin-jang.medium.com/javascript-15%EA%B0%80%EC%A7%80-%EC%9C%A0%EC%9A%A9%ED%95%9C-map-reduce-filter-bfbc74f0debd)