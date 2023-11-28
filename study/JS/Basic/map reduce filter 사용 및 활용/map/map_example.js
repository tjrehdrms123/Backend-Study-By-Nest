// =============================================
// 상수 선언
// =============================================
const numbers = [1, 4, 9, 64, 100];
const strings = ["Cat", "Dog", "ABC", "ZOO"];
const kvArray = [
  { id: 1, name: "김길동", role: "admin" },
  { id: 2, name: "김수동", role: "user" },
  { id: 3, name: "김고동", role: "user" },
];
const params = { lat: 45, lng: 6, alt: 1000 };

// =============================================
// 01. 형 변환
// Result : 01.숫자를 문자형으로: [ '1', '4', '9', '64', '100' ]
// =============================================
const numberToString = numbers.map(String);
console.log("01.숫자를 문자형으로:", numberToString);

// =============================================
// 02. 제곱근 반환
// 제곱근 - 제곱근(square root)이란 간단히 말해 제곱의 반대 개념 즉, 제곱해서 a가 되는 실수를 모두 a의 제곱근(루트 a)이라고 부르며, 기호로는 '√'을 사용합니다.
//  - Example : 4 = 2*2, 9 = 3*3
// Result : 02.제곱근 반환 [ 1, 2, 3, 8, 10 ]
// =============================================
const roots = numbers.map(Math.sqrt);
console.log("02.제곱근 반환", roots);

// =============================================
// 03. map을 활용해 배열 속 객체를 재구성하기
// Result : 03.map을 활용해 배열 속 객체를 재구성하기: [ { '1': '김길동' }, { '2': '김수동' }, { '3': '김고동' } ]
// =============================================
const kvToRestr = kvArray.map((obj) => {
  const rObj = {};
  rObj[obj.id] = obj.name;
  return rObj;
});
console.log("03.map을 활용해 배열 속 객체를 재구성하기:", kvToRestr);

// =============================================
// 04. 배열 안의 각각의 item에서 특정 키로 유일한 값들 뽑아내기
// Result - 04. 배열 안의 각각의 item에서 특정 키로 유일한 값들 뽑아내기: [ 'admin', 'user' ]
// =============================================
let listOfUserRoles = [...new Set(kvArray.map((it) => it.role))];
console.log(
  "04. 배열 안의 각각의 item에서 특정 키로 유일한 값들 뽑아내기:",
  listOfUserRoles
);

// =============================================
// 05. 객체를 쿼리스트링으로 인코딩하기
// Result - 05. 객체를 쿼리스트링으로 인코딩하기: "lat=45&lng=6&alt=1000"
// =============================================
let queryString = Object.entries(params)
  .map((p) => encodeURIComponent(p[0]) + "=" + encodeURIComponent(p[1]))
  .join("&");

console.log("05. 객체를 쿼리스트링으로 인코딩하기:", queryString);
