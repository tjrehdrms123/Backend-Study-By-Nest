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
// 01. 특정 키의 빈도를 포함하는 객체를 만들기
// Result : 01.특정 키의 빈도를 포함하는 객체를 만들기: [ '1', '4', '9', '64', '100' ]
// =============================================
let groupByRoles = kvArray.reduce(
  (acc, it) => ({ ...acc, [it.role]: (acc[it.role] || 0) + 1 }),
  {}
);
console.log("01.특정 키의 빈도를 포함하는 객체를 만들기:", groupByRoles);
// groupByAge is {23: 1, 28: 2, 34: 1}
