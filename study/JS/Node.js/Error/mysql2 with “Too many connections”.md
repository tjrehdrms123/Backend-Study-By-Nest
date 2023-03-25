![](/study/assets/thumbnail_node.png)

# mysql2 with “<strong>Too many connections”</strong>

## Connection Pool 개념

데이터베이스에 연결된 `Connection`을 미리 만들어 둔후 Pool에 보관하였다가 필요할 때 `Pool`에서 `Connection`을 가져다 사용한 후, 다시 Pool에 반환하는 기법입니다. `Connection Pool`을 이용하면 여러 `Connection`을 이용할 수 있기 때문에 더 큰 부하를 견딜 수 있습니다.

## 에러분석

mysql에서 크롤링(스크래핑)한 데이터를 DB로 넣는 중 Too many connections에러가 발생 했다 초기에 해당 에러가 발생했을때는 connectionLimit의 값을 늘려줬습니다. 하지만 계속 에러가 발생해서 찾아 본 결과 만들어진 Pool을 반납(release)하지 않아서 생긴 문제였습니다.

```js
try {
  let sql = `INSERT INTO ${table}(${key1}, ${key2}, ${key3}) VALUES("${value1}", "${value2}", "${value3}")`;
  await conn.query(sql);
} catch (err) {
  console.log(err);
} finally {
  // 추가한 코드
  conn.release();
}
```
