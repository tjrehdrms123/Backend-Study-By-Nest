# Upsert

Unique 컬럼에 값이 없으면 Insert 하고, Unique 컬럼에 값이 있으면 update 하는 `INSERT INTO ON DUPLICATE KEY UPDATE` 쿼리를 사용하여 `Upsert`를 구현 할 수 있습니다.

## 샘플 테이블
```sql
DROP TABLE animal; 
CREATE TABLE animal ( 
    name VARCHAR(25), 
    type VARCHAR(50) 
); 
ALTER TABLE animal ADD UNIQUE (name);
```

## Upsert SQL Sample

1. Insert

Name 컬럼(Unique)에 동일한 값이 없기 떄문에 정상적으로 Insert 됩니다.

```sql
INSERT INTO animal (name,type) VALUES ('mewo','cat') 
  ON DUPLICATE KEY UPDATE name='mewo', type='cat'
```


```sql
+------+------------+
| name | type       |
+------+------------+
| mewo  | cat       |
+------+------------+
```

2. Update

Name 컬럼(Unique)에 동일한 값이 있기 떄문에 정상적으로 Update 됩니다.

```sql
INSERT INTO animal (name,type) VALUES ('mewo','dog') 
  ON DUPLICATE KEY UPDATE name='mewo', type='dog'
```


```sql
+------+------------+
| name | type       |
+------+------------+
| mewo  | dog       |
+------+------------+
```