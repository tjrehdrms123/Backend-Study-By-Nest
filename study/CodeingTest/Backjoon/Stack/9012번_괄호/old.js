let fs = require('fs');
let input = fs.readFileSync('./input.txt').toString().split('\n');

const inputLength = Number(input[0]);

let result =  []; // 결과 배열

for (let i = 1; i <= inputLength; i++) {
  let leftParenthesis = []; // 왼쪽 괄호
  let rightParenthesis = []; // 오른쪽 괄호
  for (let j = 0; j < input[i].length; j++) {
    if(input[i][j] == '('){
      leftParenthesis.push(input[i][j]);
    } 
    if(input[i][j] == ')'){
      rightParenthesis.push(input[i][j]);
    }
  }
  if(leftParenthesis.length === rightParenthesis.length){
    result.push("YES");
  } else if(leftParenthesis.length != rightParenthesis.length){ 
    result.push("NO");
  }
}
return result;