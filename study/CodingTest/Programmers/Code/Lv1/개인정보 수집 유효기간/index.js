const today = "2020.01.01";
const terms = ["Z 3", "D 5"];
const privacies = [
  "2019.01.01 D",
  "2019.11.15 Z",
  "2019.08.02 D",
  "2019.07.01 D",
  "2018.12.28 Z",
];
// result : [1, 3]

// "2020.01.01"	| ["Z 3", "D 5"] | ["2019.01.01 D", "2019.11.15 Z", "2019.08.02 D", "2019.07.01 D", "2018.12.28 Z"]

/**
모든날은 28일까지 있다.
1. expirationMonth가 11보다 크면 년도랑 비교
2. 
*/

function solution(today, terms, privacies) {
  let termsFormat = {};
  let result = [];

  // today 포맷팅
  const [Tyear, Tmonth, Tday] = today.split(".");

  // terms 포맷팅
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
    const [Pyear, Pmonth, Pday] = pDay.split(".");
    const expirationMonth = termsFormat[type]; // 만료 Month 조건
    const remainYear = parseInt(Tyear) - parseInt(Pyear); // 남은 년
    let remainMonth = parseInt(Tmonth) - parseInt(Pmonth); // 남은 개월
    const remainDay = parseInt(Tday) - parseInt(Pday); // 남은 일

    remainMonth += remainYear > 0 ? remainYear * 12 : ""; // 잔여 년도 Month로 옮기기

    console.log("--------------------------------------------------");
    console.log("expirationMonth:", expirationMonth);
    console.log("remainYear:", remainYear);
    console.log("remainMonth:", remainMonth);
    console.log("remainDay:", remainDay);

    if (expirationMonth <= remainMonth && remainDay >= 0) {
      result.push(j + 1);
    }
  }
  console.log(result);
  return result;
}

solution(today, terms, privacies);
