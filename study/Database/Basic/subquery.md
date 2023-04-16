# 서브쿼리(subquery)

## 서브쿼리의 종류

서브 쿼리는 쓰이는 위치에 따라 3가지의 종류로 나뉠 수 있습니다.

- Scalar subquery
  - `sql SELECT col1, (SELECT ...)`
  - 하나의 컬럼처럼 사용 (표현 용도)
- inline view
  - `sql  FROM (SELECT ...)`
  - 하나의 테이블처럼 사용 (테이블 대체 용도)
- subQuery
  - `sql WHERE col = (SELECT ...) `
  - 하나의 변수(상수)처럼 사용 (서브쿼리의 결과에 따라 달라지는 조건절)
