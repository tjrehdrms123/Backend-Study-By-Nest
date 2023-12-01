const dartResult = "1S2D*3T"; // 1 * 2 + 4 * 2 + 27

/**
  (S) Single 1제곱
  (D) Double 2제곱
  (T) Triple 3제곱
   - 스타상(*) 당첨 시 해당 점수와 바로 전에 얻은 점수를 각 2배
   - 아차상(#) 당첨 시 해당 점수는 마이너스
*/

// 일자 요구사항 : 모든날은 28일까지 있다.
function solution(dartResult) {
  let otherValue = 0,
    nowValue = "",
    beforeValue = "";

  for (let idx = 0; idx < dartResult.length; idx++) {
    switch (dartResult[idx]) {
      case "S":
        nowValue = nowValue;
        break;
      case "D":
        nowValue = Math.pow(Number(nowValue), 2).toString();
        break;
      case "T":
        nowValue = Math.pow(Number(nowValue), 3).toString();
        break;
      case "*":
        beforeValue = String(Number(beforeValue) * 2);
        nowValue = String(Number(nowValue) * 2);
        break;
      case "#":
        nowValue = Number(nowValue * -1).toString();
        break;
      default:
        if (dartResult[idx + 1] === "0" && dartResult[idx] === "1") {
          otherValue += Number(beforeValue);
          beforeValue = nowValue;
          nowValue = "10";
          idx++;
        } else {
          otherValue = otherValue + Number(beforeValue);
          beforeValue = nowValue;
          nowValue = dartResult[idx];
        }
    }
  }
}

solution(dartResult);
