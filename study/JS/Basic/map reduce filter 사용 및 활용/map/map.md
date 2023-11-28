# Array.prototype.map()

map() 메서드는 배열 내의 모든 요소 각각에 대하여 주어진 함수를 호출한 결과를 모아 `새로운 배열`을 반환합니다.

### 구문
```js
arr.map(callback(currentValue[, index[, array]])[, thisArg])
```

### 매개변수
- callback
  새로운 배열 요소를 생성하는 함수. 다음 세 가지 인수를 가집니다.
  - currentValue
  처리할 현재 요소.
  - index `Optional`
  처리할 현재 요소의 인덱스.
  - array `Optional`
  map()을 호출한 배열.
- thisArg `Optional`
callback을 실행할 때 this로 사용되는 값.

### 반환 값

배열의 각 요소에 대해 실행한 callback의 결과를 모은 새로운 배열.

### 예시
```js
const array1 = [1, 4, 9, 16]; // 순회할 target array

// target array(array1)의 원소를 순회하면서 *2 한 결과 배열을 반환
const map1 = array1.map((x) => x * 2);

console.log(map1);
// Expected output: Array [2, 8, 18, 32]

```

### QnA
```js
const array1 = [1, 4, 9, 16]; // 순회할 target array
const map1 = array1.map(() => {});

console.log(map1); // [undefined, undefined, undefined, undefined]
```

위와 같이 Map 메서드를 호출할때 왜 `undefined`으로 값이 채워지는지 궁금했습니다.

그 이유는 폴리필 31번째 라인에서 `A = new Array(len);` 기존 Array의 length로 새로운 Array를 만들어서 그렇습니다.

### 폴리필
- [Map 폴리필](./map_polyfills.js)

### 예제
- [map_example.js](./map_example.js)

### 참고
- [MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [Medium](https://dongmin-jang.medium.com/javascript-15%EA%B0%80%EC%A7%80-%EC%9C%A0%EC%9A%A9%ED%95%9C-map-reduce-filter-bfbc74f0debd)