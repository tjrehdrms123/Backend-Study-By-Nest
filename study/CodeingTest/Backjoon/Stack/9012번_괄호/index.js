let fs = require('fs');
let input = fs.readFileSync('./input.txt').toString().split('\n');

const inputLength = Number(input[0]);

let result =  []; // 결과 배열

for (let i = 1; i <= inputLength; i++) {
  let leftBracket = []; // 왼쪽 괄호
  let rightBracket = []; // 오른쪽 괄호
  let temp = []; // 쌍을 없애고 남은 괄호 모음
  for (let j = 0; j < input[i].length; j++) {
    if (input[i][j] == '('){
      leftBracket.push(input[i][j]);
      temp.push(input[i][j]);
    }
    if(input[i][j] == ')'){
      if(temp.length != 0 && temp[0] != ')'){
        rightBracket.push(input[i][j]);
        temp.pop();
      } else {
        // 없앨 수 있는 왼쪽 괄호가 없는데 오른쪽 괄호가 있을때 ex) (())())
        // 괄호가 쌍을 이루지 못하고 ')' 오른쪽 괄호 만 있을때 ex) ()))
        temp.push(input[i][j]);
      }
    }
  }
  if(leftBracket.length === 0 || rightBracket.length === 0) {
    // 왼쪽 괄호, 오른쪽 괄호 없을때 예외처리
    result.push("NO");
  } else if(temp.length === 0){
    result.push("YES");
  } else {
    result.push("NO");
  }
  // 사용한 변수 메모리 해제
  leftBracket = [];
  rightBracket = [];
  temp = [];
}
console.log(result.join("\n"));