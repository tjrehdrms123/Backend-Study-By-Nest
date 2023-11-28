if (!Array.prototype.filter2) {
  Array.prototype.filter2 = function (func, thisArg) {
    "use strict";
    // 콜백함수의 타입이 function이 아니거나 this가 falsy한 값이라면 타입에러를 발생시킨다.
    if (!((typeof func === "Function" || typeof func === "function") && this))
      throw new TypeError();

    // map 메서드와 동일하게 배열 길이를 저장하기 위한 변수인 len은 0이나 양수를 보장한다.
    var len = this.length >>> 0,
      // 최종 반환할 배열과 필요한 변수들을 초기화하였다.
      res = new Array(len),
      t = this,
      c = 0,
      i = -1;

    // thisArg를 전달받은 경우와 전달받지 못한 경우로 구분해서 반복문을 실행시켰다.
    if (thisArg === undefined) {
      while (++i !== len) {
        if (i in this) {
          // 콜백함수에 인수로 요소, 인덱스, filter를 호출한 객체를 넘기며 실행시켜서 값이 true가 반환될 때만 최종반환할 배열에 요소를 저장한다.
          if (func(t[i], i, t)) {
            res[c++] = t[i];
          }
        }
      }
    } else {
      while (++i !== len) {
        if (i in this) {
          if (func.call(thisArg, t[i], i, t)) {
            res[c++] = t[i];
          }
        }
      }
    }

    // 처음에 반환 배열을 생성할 때 filter 메서드를 호출한 배열의 크기로 생성했기 때문에 반환 배열에 저장된 요소 개수로 length 값을 맞추고 반환한다.
    res.length = c;
    return res;
  };
}
