# Promise all에 대해서

해당 코드는 3개의 쿼리를 날리는 코드입니다.

### A 코드

```js
export const data = async () => {
  await AppDataSource.query(query); // execution time: 3 seconds
  await AppDataSource.query(query); // execution time: 5 seconds
  await AppDataSource.query(query); // execution time: 2 seconds
};
```

### async-await

3개의 쿼리문의 코드가 async-await 을 통해 순차적으로 실행되는 모습입니다.

얼핏 보면 A코드는 비동기 로직 제어에 성공한 것처럼 보이지만 순차적으로 실행되는 3회의 요청으로 인해 10초의 시간이 소요됩니다.

async-await는 비동기 동작(프라미스)의 상태가 완료될 때까지 기다린 후, 다음 코드를 순차적으로 읽어 나가며 실행합니다.

![](/study/assets/content_js_promise01.png)

async-await은 비동기 함수의 순서가 보장되어야 할 때는 분명 강력하지만, 각각의 태스크가 서로 연관성이 없는 작업일 때는 앞의 작업이 끝날 때까지 기다릴 필요가 없습니다.

### Promise.all

이런 상황에 `Promise.all`을 사용 합니다. 여러 비동기 동작(프라미스)을 하나로 묶어 하나의 프라미스처럼 관리할 수 있게 해줍니다.

Promise.all은 여러 비동기 태스크를 동시에(병렬적으로) 실행하고, 가장 마지막 태스크가 완료될 때 완료 상태의 프라미스를 반환합니다.

![](/study/assets/content_js_promise02.png)

### B 코드

```js
const [aQuery, bQuery, cQuery] = await Promise.all([
  AppDataSource.query(query); // execution time: 3 seconds
  AppDataSource.query(query); // execution time: 5 seconds
  AppDataSource.query(query); // execution time: 2 seconds
]);
```

의 예제의 실행시간은 모든 태스크를 더한 3초 + 5초 + 2초가 아닌, 가장 오래 걸린 태스크의 실행시간인 5초의 시간만이 소요 됩니다.

### 주의사항

여러개의 비동기 함수의 순서가 중요하다면: async-await
여러개의 비동기 함수의 순서가 중요하지 않다면: Promise.all을 통해 묶어서 병렬처리를 통해 관리가 가능합니다.
