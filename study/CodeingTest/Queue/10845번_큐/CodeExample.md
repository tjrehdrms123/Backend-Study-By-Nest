# fs 모듈을 이용하는 방법(백준 제출용)
```js
// 제출할떄 파일 경로 아래로 변경해줘야됨
fs.readFileSync('/dev/stdin')
```

## 1) 한 줄로 입력을 받을 때

### 한 줄 입력
```js
let fs = require('fs');
let input = fs.readFileSync('/dev/stdin').toString().split(' ');

let num = Number(input);

for (let i = 1; i <= num; i++) {
  console.log(i);
}
```
## 2) 여러 줄로 입력을 받을 때

### 여러 줄 입력
```js
let fs = require('fs');
let input = fs.readFileSync('/dev/stdin').toString().split('\n');

let count = input[0];
let numbers = [];

for (let i = 1; i < input.length; i++) {
  if (input[i] !== '') {
    numbers.push(input[i].split(' '));
  }
}

for (let i = 0; i < numbers.length; i++){
  let num1 = Number(numbers[i][0]);
  let num2 = Number(numbers[i][1]);

  console.log(num1 + num2);
}
```