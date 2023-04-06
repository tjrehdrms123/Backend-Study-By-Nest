![](/study/assets/thumbnail_liunx.png)

### Hosting 사용중인 용량 체크
> `home`폴더 하위 폴더의 용량을 `userhosting`폴더 및 날짜.txt파일로 반환하는 코드입니다.
```sh
du -h --max-depth=1 /home > /userhosting/$(date '+%Y%m%d').txt
```

출력 결과
```sh
4.0K    /home/test/user1
4.0K    /home/test/user2
12K     /home/test
...
```

### Mysql DB별 용량 체크
> MB단위로 출력합니다.
```sql
SELECT table_schema AS DBMS, CONCAT((SUM(data_length + index_length) / 1024 / 1024)," MB") AS "Size" FROM information_schema.TABLES GROUP BY table_schema;
```

출력 결과
```
db_user1	1.20312500 MB
db_user2	8.02880096 MB
...
```