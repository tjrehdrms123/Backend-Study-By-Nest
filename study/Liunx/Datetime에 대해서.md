![](/study/assets/thumbnail_liunx.png)

# Liunx date time에 대해서

> crontab에 백업 날짜를 6시로 진행했다

Crontab Code

```shell
0 18 * * * /home/backup.sh
```

하지만 백업된 날짜는 한국 기준으로 새벽 3시였다 알고보니 한국 시간은 <strong>+9시간</strong>이 더 빨랐다
알고 보니 리눅스는 UTC기준으로 날짜가 설정되어있었다
해당 명령어로 어디쪽 타임존으로 설정되어있는지 확인 할수 있다

```shell
ls -al /etc/localtime
```

/usr/share/zoneinfo 폴더에가면 빌드인 되어있는 타임존을 확인할수있습니다
![image.png](/study/assets/content_liunx_datetime.png)
Asia/Seoul 타임존으로 변경하는 명령어

```shell
ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
```

동작확인
전 : Fri Jan 28 09:14:28 UTC 2022
후 : Fri Jan 28 18:15:04 KST 2022