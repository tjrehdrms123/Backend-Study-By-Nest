![](/study/assets/thumbnail_os.png)

# BigO와 슈도코드 그리고 시간복잡도 구하기 

## 시간복잡도(Time Complexity)
작성한 코드의 반복문을 몇 번 사용했는지, 입력값은 어떻게 되는지 등을 통해 대략적으로 추측할 수 있습니다.
입력값과 연산 수행 시간의 상관관계를 나타내는 척도를 시간 복잡도라고 합니다.

> `상관관계`는 어떤 변수가 증가할 때 다른 변수가 함께 증가하는지, 혹은 감소하는지 관찰해서 파악합니다. 예를 들어 체중과 신장 사이에는 양의 상관관계가 있다고 할 수 있습니다. 키가 커지면 대체적으로 체중이 증가한다는 의미입니다.

## BigO란?
일반적으로 상수와 계수를 제거하고 알고리즘의 복잡도를 단순화하여 나타내는 점근법 중 하나 입니다.
```
# 상수: 3
# 변수: a,b
# 계수: 2
2a + 3 – 2b
```

> `점근법` 어떤 함수의 증가 양상을 다른 함수와의 비교로 표현하는 수론과 해석학의 방법입니다.

빅오 표기법은 최악의 경우를 고려하므로, 프로그램이 실행되는 과정에서 소요되는 최악의 시간까지 고려할 수 있기 때문에 제일 느린 시간 복잡도를 표현합니다.


# Big-O 표기법의 종류
## O(1) (constant complexity / 상수시간)
입력값이 증가하더라도 시간이 늘어나지 않습니다.
입력값의 크기와 관계없이, 즉시 출력값을 얻어낼 수 있습니다.

사용 용도: 스택의 Push, Pop에서 사용됩니다.

ex) 예시 코드
```js
function O_1_algorithm(arr, index) {
	return arr[index];
}

let arr = [1, 2, 3, 4, 5];
let index = 1;
let result = O_1_algorithm(arr, index);
console.log(result); // 2
```
arr의 값이 아무리 길더라도 접근하고자 하는 index의 값이 있다면 바로 접근 할 수있습니다.

## O(n) (linear complexity / 선형 복잡도)
입력값이 증가함에 따라 시간 또한 `같은 비율`로 증가하는 것을 의미합니다.

사용 용도: for, while, map과 같은 반목문에서 사용됩니다.

ex) 예시 코드
```js
function O_n_algorithm(arr, target) {
  let value;
  for(i=0; i<arr.length; i++){
    if(arr[i] === target){
      value = i;
    }
  }
	return value;
}

let arr = [1, 2, 3, 4, 5];
let target = 1;
let result = O_n_algorithm(arr, target);
console.log(result); // 0
// target과 같은 값이 배열의 몇 번째 원소에 있는지 확인하는 함수
```
for 루프는 배열의 모든 요소를 한 번씩 반복하므로, 배열의 크기에 비례하여 실행 시간이 증가합니다. 즉, 배열의 크기가 n일 때, 이 함수의 실행 시간은 n에 비례하며, 따라서 O(n) 시간 복잡도를 갖습니다.

## O(log n) (logarithmic complexity / 로그 복잡도)

![](/study/assets/content_codeingtest_bigO.jpeg)
