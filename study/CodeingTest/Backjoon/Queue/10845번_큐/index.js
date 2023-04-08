let fs = require("fs");
let input = fs.readFileSync("./input.txt").toString().split("\n");

const inputLength = Number(input[0]);

let result = []; // 결과 배열
let temp = []; // 임시 배열

class Queue {
  front() {
    return temp[0] === undefined ? result.push(-1) : result.push(temp[0]);
  }
  back() {
    return temp[temp.length - 1] === undefined
      ? result.push(-1)
      : result.push(temp[temp.length - 1]);
  }
  size() {
    return result.push(temp.length);
  }
  empty() {
    return temp.length === 0 ? result.push(1) : result.push(0);
  }
  push(x) {
    return temp.length === 0 ? (temp[0] = x) : (temp[temp.length] = x);
  }
  pop() {
    return temp.length === 0 ? result.push(-1) : result.push(temp.shift());
  }
}

const queue = new Queue();
for (let i = 1; i <= inputLength; i++) {
  let status = input[i].trim().split(" ");
  switch (status[0]) {
    case "front":
      queue.front();
      break;
    case "back":
      queue.back();
      break;
    case "size":
      queue.size();
      break;
    case "empty":
      queue.empty();
      break;
    case "push":
      queue.push(status[1]);
      break;
    case "pop":
      queue.pop();
      break;
  }
}
console.log(result.join("\n"));
