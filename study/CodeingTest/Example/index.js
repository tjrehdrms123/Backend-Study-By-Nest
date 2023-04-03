let fs = require('fs');
// 제출 용 : /dev/stdin
let input = fs.readFileSync('./input.txt').toString().split('\n');

let count = input[0];
let numbers = [];

for (let i = 1; i < input.length; i++) {
  if (input[i] !== '') {
    numbers.push(input[i].split(' '));
  }
}

for (let i = 0; i < numbers.length; i++){
  let num1 = String(numbers[i][0]);
  console.log(num1);
}