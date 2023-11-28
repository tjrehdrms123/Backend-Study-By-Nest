# Array.prototype.filter()

Array 인스턴스의 filter() 메서드는 주어진 배열의 일부에 대한 얕은 복사본을 생성하고, `주어진 배열에서 제공된 함수에 의해 구현된 테스트를 통과한 요소로만 필터링` 합니다.

### 구문
```js
filter(callbackFn)
filter(callbackFn, thisArg)
```

### 매개변수
- callbackFn
  배열의 각 요소에 대해 실행할 함수입니다. 결과 배열에 요소를 유지하려면 참 값을 반환하고 그렇지 않으면 거짓 값을 반환해야 합니다. 이 함수는 다음 인수를 사용하여 호출됩니다.
  - element
    - 배열에서 처리 중인 현재 요소.
  - index
    - 배열에서 처리 중인 현재 요소의 인덱스.
  - array
    - filter()가 호출된 배열.
- thisArg `Optional`
  - callbackFn을 실행할 때 this 값으로 사용할 값입니다. 순회 메서드를 참조하세요.

### 반환 값

주어진 배열의 일부에 대한 얕은 복사본으로, 주어진 배열에서 제공된 함수에 의해 구현된 테스트를 통과한 요소로만 필터링 합니다. 테스트를 통과한 요소가 없으면 빈 배열이 반환됩니다.

### 예시
```js
const array1 = [1, 4, 9, 16]; // 순회할 target array

// target array(array1)의 원소를 순회하면서 10보다 큰 결과 배열을 반환
const filter1 = array1.filter((x) => {
  return x > 10;
});

console.log(filter1);
// Expected output: Array [16]


```

### 폴리필
- [filter 폴리필](./filter_polyfills.js)

### 예제
- [filter_example.js](./filter_example.js)

### 참고
- [MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [Medium](https://dongmin-jang.medium.com/javascript-15%EA%B0%80%EC%A7%80-%EC%9C%A0%EC%9A%A9%ED%95%9C-map-reduce-filter-bfbc74f0debd)