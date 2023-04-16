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

## Scalar subquery

아래의 쿼리는 회원 테이블의 ID와 주문 테이블에( 사용자 ID, 사용자의 지역, 주문 일자 )를 가져오는 쿼리 문 입니다.

아래와 같이 SELECT 뒤에 속성 이름 대신 쿼리를 통해 얻은 결과를 하나의 속성으로 사용합니다.

이 때, subquery는 집계 함수 등을 사용하여 하나의 결과가 나오도록 해야 한다.

```sql
select
	c.CustomerID, c.CountryRegion, (select so.OrderDate from SalesOrder as so where so.CustomerID = c.CustomerID) as soStatus
from Customer as c
```

## inline view

FROM에서 subquery를 사용하면 새로운 쿼리를 통해 얻은 데이터에서 다시 데이터를 조회할 수 있습니다.

이렇게 FROM 절에서 사용하여 새로운 데이터 조회를 위해 사용되는 subquery를 Inline View라고 한다.

## subQuery

아래의 쿼리는 평균 배송기간보다 빨리 배송된 주문 건을 구하는 쿼리입니다.

WHERE에서 subquery를 사용할 때는 조회한 결과를 통해 조건을 만들 때 사용하게 된다.

```sql
select * from SalesOrder as so where DATEDIFF(day, OrderDate, ShipDate) <= (
	select avg(datediff(day,OrderDate,ShipDate)) from SalesOrder
)
```

## 서브쿼리로 가상 테이블 만들기

```sql
select * from
( select CustomerId, FirstName
from Customer
) tmp_table;
```

## 참고

- [https://www.youtube.com/watch?v=oc-ya1MpK5c&list=LL&index=1](https://www.youtube.com/watch?v=oc-ya1MpK5c&list=LL&index=1)
- [https://data-make.tistory.com/25](https://data-make.tistory.com/25)
- [https://ju-hy.tistory.com/100](https://ju-hy.tistory.com/100)
