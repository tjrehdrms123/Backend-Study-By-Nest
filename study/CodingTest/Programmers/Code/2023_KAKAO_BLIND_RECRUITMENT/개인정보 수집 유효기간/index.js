const today = "2020.01.01";
const terms = ["Z 3", "D 5"];
const privacies = [
  "2019.01.01 D",
  "2019.11.15 Z",
  "2019.08.02 D",
  "2019.07.01 D",
  "2018.12.28 Z",
];

/**
 1. 
 2.
 3. 
 */

// 일자 요구사항 : 모든날은 28일까지 있다.
function solution(today, terms, privacies) {
  let termsFormat = {};
  let result = [];

  // today 포맷팅 [년,월,일] 분리
  const [Tyear, Tmonth, Tday] = today.split(".");

  // terms 포맷팅 [타입,정보 파기해야되는 월] 분리
  for (let i = 0; i < terms.length; i++) {
    const [type, tMonth] = terms[i].split(" ");
    termsFormat = {
      ...termsFormat,
      [type]: parseInt(tMonth),
    };
  }

  // privacies 포맷팅 및 값 비교
  for (let j = 0; j < privacies.length; j++) {
    const [pDay, type] = privacies[j].split(" ");
    const [Pyear, Pmonth, Pday] = pDay.split("."); // 수집일 [년,월,일] 분리
    const expirationMonth = termsFormat[type]; // 만료 Month 조건 값을 가져옴
    const remainYear = parseInt(Tyear) - parseInt(Pyear); // Today로 부터 수집까지 지난 년
    let remainMonth = parseInt(Tmonth) - parseInt(Pmonth); // Today로 부터 수집까지 지난 개월
    const remainDay = parseInt(Tday) - parseInt(Pday); // Today로 부터 수집까지 지난 일

    remainMonth += remainYear > 0 ? remainYear * 12 : ""; // 잔여 년도 Month로 옮기기
    remainMonth += remainDay >= 28 ? Math.floor(remainDay / 28) : ""; // 잔여 일 Month로 옮기기
    // ========================================
    // 조건: 현재 만료 기준은 개월이기 때문에 개월로 비교
    //
    // 1. first if : 만료 월(expirationMonth)이 남은 월(remainMonth)보다 작거나 같고, 동시에 두 값이 다른 경우'
    // 2. second if : 만료 월(expirationMonth)이 남은 월(remainMonth)과 동일하며, 동시에 남은 일(remainDay)이 0 이상인 경우
    // ========================================
    if (expirationMonth <= remainMonth && expirationMonth != remainMonth) {
      result.push(j + 1);
    }
    if (expirationMonth == remainMonth && remainDay >= 0) {
      result.push(j + 1);
    }
  }
  return result;
}

solution(today, terms, privacies);
