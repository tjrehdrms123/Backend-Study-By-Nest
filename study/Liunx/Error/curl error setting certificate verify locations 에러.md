# curl error setting certificate verify locations 에러

```bash
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

curl: (77) error setting certificate verify locations:
CAfile: /etc/ssl/certs/ca-certificates.crt
CApath: /etc/ssl/certs
```

다음과 같이 curl 명령어를 실행했을때 인증서를 담당하는 `ca-certificates.crt`파일이 없다고 에러가 나옵니다.

```bash
$ cd /etc/ssl/certs
$ curl -k -O -L https://curl.haxx.se/ca/cacert.pem
$ mv cacert.pem ca-certificates.crt
```

수동으로 인증서를 다운받고 이름을 변경해 해결해야됩니다.