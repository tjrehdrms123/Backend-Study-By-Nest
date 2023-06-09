# root 계정 활성 화 및 Key파일 없이 접속하기

### root 계정의 암호를 설정해 준다.
```bash
su passwd root 
```

### SSH 설정을 변경한다.
```bash
# vi /etc/ssh/sshd_config 
PermitRootLogin yes 
yesPasswordAuthentication yes
```

### root 로그인 허용 (ec2)
해당 문구 제거
```bash
# vi /root/.ssh/authorized_keys 
no-port-forwarding,no-agent-forwarding,no-X11-forwarding,command="echo 'Please login as the user \"ubuntu\" rather than the user \"root\".';echo;sleep 10" 
```

### SSH 재시작
```bash
sudo service ssh restart
```