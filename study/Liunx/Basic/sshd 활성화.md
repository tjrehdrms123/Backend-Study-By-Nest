![](/study/assets/thumbnail_liunx.png)

# sshd 활성화 및 설정

## sshd 활성화 방법

- ssh를 사용할 수 있게 하는 opensh-server 패키지를 설치합니다.

```bash
sudo apt update
sudo apt install openssh-server -y

# 설치 후 ssh가 실행 중 인지 확인 합니다.
sudo systemctl status ssh
```

## sshd 설정 방법

- 파일명 : vi /etc/ssh/sshd_config
- 주석되어있는 값이 있다면 기본 값으로 들어가기 떄문에 해당 sshd_config파일에 `PasswordAuthentication` 옵션만 **yes**로 변경하면됩니다.

```bash
# 연결 Port 설정
Port 포트 명

# SSH root 계정 접근제한 설정
PermitRootLogin 설정 값

# ssh 패스워드로 로그인 설정하기
PasswordAuthentication 설정 값
```

**시스템에서 방화벽을 사용하도록 설정한 경우 SSH 포트를 엽니다.**

[방화벽 설정 및 해제 방법](./%EB%B0%A9%ED%99%94%EB%B2%BD%20%EC%84%A4%EC%A0%95%EB%B0%A9%EB%B2%95.md)

참고 : [https://makingrobot.tistory.com/115](https://makingrobot.tistory.com/115)