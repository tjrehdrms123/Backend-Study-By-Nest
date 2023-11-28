// Array.prototype에 map이 존재하지 않을 때에만 map polyfill을 실행한다.
if (!Array.prototype.map) {
  // map은 인수로 콜백함수와, 콜백함수를 호출할 때 this 바인딩할 값을 전달받는다.
  Array.prototype.map = function (callback, thisArg) {
    // T = 콜백함수 호출 시 this에 바인딩할 값
    // A = 최종적으로 반환할 배열
    // k = 인덱스로 사용할 변수
    var T, A, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }

    // this에 바인딩된 값(map을 호출한 배열)을 인수로 객체를 생성하고 O에 할당한다.
    var O = Object(this);

    // map 폴리필의 가장 생소한 부분이었는데, >>>는 부호 없는 시프트 연산자로 var len에는 O.length가 음수로 평가되더라도 양수임이 보장된다.
    var len = O.length >>> 0;

    // 첫 번째 인수로 전달한 콜백함수의 타입이 function이 아니라면 에러를 발생시킨다.
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }

    // map을 호출할 때 2개 이상의 인수를 전달했다면 thisArg를 전달받았으므로 T에 thisArg를 할당한다.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // len 크기의 새로운 배열을 생성한다.
    A = new Array(len);

    k = 0;

    // K를 0부터 len까지 반복문을 돌린다.
    while (k < len) {
      var kValue, mappedValue;

      if (k in O) {
        kValue = O[k];

        // 콜백함수를 호출하여 T를 콜백함수의 this에 바인딩하고, 콜백함수의 인수로 O의 요소, 인덱스, O 자체를 넘겨서 반환 받은 값을 mappedValue에 저장한다.
        mappedValue = callback.call(T, kValue, k, O);

        // 반환받은 값을 새로 생성한 A의 k 인덱스에 저장한다.
        A[k] = mappedValue;
      }
      k++;
    }

    // 반복문을 모두 돌고 배열 A를 반환한다.
    return A;
  };
}
