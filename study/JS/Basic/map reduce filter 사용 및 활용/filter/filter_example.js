// =============================================
// 상수 선언
// =============================================
const numbers = [1, 4, 9, 64, 100];
const numbersB = [2, 4, 9, 200, 64];
const strings = ["Cat", "Dog", "ABC", "ZOO"];
const kvArray = [
  { id: 1, name: "김길동", role: "admin" },
  { id: 2, name: "김수동", role: "user" },
  { id: 3, name: "김고동", role: "user" },
];
const params = { lat: 45, lng: 6, alt: 1000 };

// =============================================
// 01. 간단한 검색
// Result : 01.간단한 검색: [ '1', '4', '9', '64', '100' ]
// =============================================
let targetRole = "user";
let findByUser = kvArray.filter((it) => it.role.includes(targetRole));
console.log("01.간단한 검색:", findByUser);

// =============================================
// 02. A, B의 교집합
// Result : 02.A, B의 교집합:
// =============================================
let arrA = numbers.filter((it) => numbersB.includes(it));
console.log("02.A, B의 교집합:", arrA);
