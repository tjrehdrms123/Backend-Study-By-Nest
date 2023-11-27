const lottos = [44, 1, 0, 0, 31, 25];
const win_nums = [31, 10, 45, 1, 6, 19];

/**
 * 리팩토링
 */

function solution(lottos, win_nums) {
  const result = [];

  const bestCase = lottos.filter((num) => num === 0); // 0이면 bestCase
  const matchingNumbers = lottos.filter(
    (num) => num !== 0 && win_nums.includes(num)
  ); // 추첨 숫자와 고른 숫자가 일치한 것

  result.push(
    rank(bestCase.length + matchingNumbers.length),
    rank(worstCase.length)
  );

  return result;
}

function rank(cnt) {
  switch (cnt) {
    case 6:
      return 1;
    case 5:
      return 2;
    case 4:
      return 3;
    case 3:
      return 4;
    case 2:
      return 5;
    default:
      return 6;
  }
}

solution(lottos, win_nums);
