const survey = ["AN", "CF", "MJ", "RT", "NA"];
const choices = [5, 3, 2, 7, 5];

/**
 * survey[i]를
 * choices[i]가 3보다 크면
 *  survey[i]의 첫번째 글자 추출 substr
 *  해당 글자에 점수 부여
 * choices[i]가 3보다 작으면
 *  survey[i]의 두번째 글자 추출 substr
 *  해당 글자에 점수 부여
 * choices[i]가 3이면 점수 X
 */

function solution(survey, choices) {
  const result = [];
  const score = [3, 2, 1, "", 1, 2, 3];
  const category = [
    ["R", "T"],
    ["C", "F"],
    ["J", "M"],
    ["A", "N"],
  ];
  const keyArr = [];
  const valArr = [];

  survey.map((el, i) => {
    if (choices[i] != 4) {
      if (choices[i] <= 3) {
        // 첫번째 문자 추출
        keyArr.push(el.substr(0, 1));
        valArr.push(score[choices[i] - 1]);
      } else if (choices[i] > 3) {
        // 두번째 문자 추출
        keyArr.push(el.substr(1, 1));
        valArr.push(score[choices[i] - 1]);
      }
    }
  });
  for (let i = 0; i < category.length; i++) {
    for (let j = 0; j < keyArr.length; j++) {
      category[i].includes(keyArr[j]) == true ? result.push(keyArr[j]) : "";
    }
  }
  console.log(result.join(""));
  // TCMA
  return result;
}

solution(survey, choices);
