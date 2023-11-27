const lottos = [44, 1, 0, 0, 31, 25];
const win_nums = [31, 10, 45, 1, 6, 19];

/**
 * 1. 정렬 시킴
 *  - lottos = [0,0,1,25,31,44]
 *  - win_nums = [1,6,10,19,31]
 * 2. 값이 있는지 검증
 *  - 배열.length 반복문
 *    - if 0이 아니면
 *      - lottos[i] === win_nums[j] 배열에 push
 * 3. 0이 있는건 best case 0이 없는 length는 worst case
 */

function solution(lottos, win_nums) {
  const result = [];

  const bestCase = [];
  const worstCase = [];

  sortLotto = lottos.sort();
  sortWinNum = win_nums.sort();

  for (let i = 0; i < sortLotto.length; i++) {
    if (sortLotto[i] === 0) {
      // 0이면 bestCase 배열에 push
      bestCase.push(sortLotto[i]);
    }
    for (let j = 0; j < sortLotto.length; j++) {
      if (sortLotto[i] === sortWinNum[j]) {
        bestCase.push(sortLotto[i]);
        worstCase.push(sortLotto[i]);
      }
    }
  }

  result.push(rank(bestCase.length), rank(worstCase.length));

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
