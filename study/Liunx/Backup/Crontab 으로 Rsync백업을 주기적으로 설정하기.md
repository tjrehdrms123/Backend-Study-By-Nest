![](/study/assets/thumbnail_liunx.png)

# Crontab 으로 Rsync백업을 주기적으로 설정하기

### 백업을 하는 쉘 스크립트를 Crontab으로 자동화 시킨 후 Rsync로 내부 서버와 동기화를 한다


사용되는 기술

* Shell Script


* Crontab


* Rsync


**tar압축을 하는 쉘 스크립트입니다**
리눅스 현재 날짜로 압축파일을 생성합니다
![](/study/assets/content_liunx_backup_01.png)

**Crontab 동작 주기 설정**
![](/study/assets/content_liunx_backup_02.png)

**Rsync-server 설정 파일**
vi /etc/default/rsync
\- RSYNC\_ENABLE=true \# false 로 있을시 true 로 변경
**위치 : /etc/rsyncd.conf**
![](/study/assets/content_liunx_backup_03.png)

**Rsync-client 설정 파일**
자동화를 위해 sshpass 설치했습니다
![](/study/assets/content_liunx_backup_04.png)

