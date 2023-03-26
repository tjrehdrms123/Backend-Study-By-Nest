# RDS PostgreSQL DB에 접근 할 수 없음

`AWS Postgres DB "does not exist" when connecting with PG` 에러 발생 시 해결 방법

<br>
[해결법] create database를 직접 쿼리 날려줘야된다.

```sql
CREATE DATABASE db_name;.
```
