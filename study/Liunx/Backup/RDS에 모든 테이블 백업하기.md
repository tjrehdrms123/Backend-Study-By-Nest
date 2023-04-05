![](/study/assets/thumbnail_liunx.png)

# RDS에 모든 테이블 백업하기
추가 작업 없이 `mysqldump`로 작업하게 되면 모든 테이블이 하나의 sql로 떨어집니다.

하나의 sql로 파일이 떨어져 데이터 복원시 불편함이 있어서 작업을 진행했습니다.

---

## 사전 작업
현재 서버에는 웹서버를 돌리고있고, DB서버는 RDS로 빠져있습니다.
백업을 진행할때 `crontab`으로 자동화활 예정인데 비밀번호를 물어보면 자동화가 불가능합니다.
그렇기 때문에 사전 작업으로 mysql 설정 파일에 미리 아이디와 비밀번호를 입력해 줍니다.
```bash
# 위치 : ~/.my.conf
[mysqldump]
user="USER ID"
password="USER PASSWORD"
column-statistics=0
```

---

## 2. RDS Backup Script작성
```bash
# 위치 : rds_backup.sh

# 날짜
today="$(date "+%Y%m%d")"
mkdir "/data/backup/db/${today}"
# 데이터베이스별로 압축 하기 위해서
for database in $(mysql -h "RDS URL" -u "USER ID" -p"USER PASSWORD" -e "USE information_schema; SELECT SCHEMA_NAME FROM SCHEMATA;"); do
    mysqldump --skip-lock-tables -h "RDS URL" -u "USER ID" ${database} > "/data/backup/db/${today}/${database}${today}backup.sql"
done
```

---

## 3. Crontab 등록
```bash
0 21 * * * /rds_backup.sh
```