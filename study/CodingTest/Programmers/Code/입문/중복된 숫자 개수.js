let result = 0;
const array = [0, 1, 1];
const n = 1;
let temp = {};
// array.forEach((it, i) => {
//   temp[it] ? temp[it]++ : (temp[it] = 1);
// });
// Object.entries(temp).map((it, i) => {
//   it[1] > 1 ? (result += it[1]) : "";
// });

array.forEach((it, i) => {
  it === n ? result++ : "";
});
console.log(result);
return result;
