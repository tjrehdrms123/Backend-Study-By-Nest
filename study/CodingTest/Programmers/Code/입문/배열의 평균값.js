const a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const b = a.reduce((acc, it) => {
  return acc + it;
}, 0);

console.log(b / a.length);
