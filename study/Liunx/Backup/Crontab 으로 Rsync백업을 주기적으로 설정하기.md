![](/study/assets/thumbnail_liunx.png)

# Crontab 으로 Rsync백업을 주기적으로 설정하기

### 백업을 하는 쉘 스크립트를 Crontab에 등록 후 Rsync로 백업 서버로 전송 방법


사용되는 기술
* Shell Script
* Crontab
* Rsync

## 1. 백업 스크립트파일 생성하기
  * 리눅스 어제 날짜로 압축파일을 생성하는 스크립트 입니다.
  * 파일명 : backup.sh
```bash
today=$(date "+%Y%m%d" -d 'yesterday')
rm -rf /backup/${today}/*
```

  * 압축된 파일을 이전 후 제거하는 스크립트 입니다.
  * 파일명 : rmfolder.sh
```bash
today=$(date "+%Y%m%d" -d 'yesterday')
rm -rf /backup/${today}/*
```

## 2. Crontab 동작 주기 설정
```bash
0 18 * * * /backup.sh
0 19 * * * /rmfolder.sh
```

## 3. Rsync-server 설정 파일
### 백업 서버 설정
```bash
log file = /var/log/rsync.log
[source]                                         # 부르고 싶은 명칭
path = "백업 소스 폴더"      # 소스 디렉토리 설정
uid = root                                       # rsync 사용 가능한 사용자
gid = root                                       # rsync 사용 가능한 그룹
use chroot = yes                            # chroot 사용여부
host allow = "백업 받을 서버 주소"           # 해당 호스트 아이피만 접근 가능
max connection = 100                   # 최대 연결 개수
timeout 300                                    # 타임아웃 시간 설정
```

### 백업 파일을 받을 서버 설정
```bash
# false 로 있을시 true 로 변경
vi /etc/default/rsync
- RSYNC_ENABLE=true
```

## 4. 백업 받기
백업 받기 진행 전 백업 데이터를 받을 서버에서 아래와 같이 입력 후 rsync접근을 수락해줘야됩니다.
```bash
sudo rsync -avz  root@아이피:/backup /data/
```

rsync로 받으려고하면 sshpass를 물어봅니다. 자동화를 위해 sshpass 설치 후 셋팅하겠습니다.
```bash
sudo rsync -avz --rsh="sshpass -p 패스워드 ssh -l root" 아이디@서버 아이피:/"백업 소스 폴더" "백업 소스를 받기 위한 폴더 주소"

# 예시
sudo rsync -avz --rsh="sshpass -p 1234 ssh -l root" root@1.12.123.1234:/backup /data/
```

## 5. 백업 파일을 받을 서버 자동화
```bash
0 20 * * * /backup.sh
```