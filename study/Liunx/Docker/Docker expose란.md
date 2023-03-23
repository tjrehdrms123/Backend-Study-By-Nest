![](/study/assets/thumbnail_docker.png)

# Docker expose란?
expose는 호스트 내부의 다른 컨테이너들만 액세스가 가능하고 ports로 노출하면 ports에 설정한 호스트 포트번호로 호스트 외부의 다른 호스트들도 호스트 포트번호로 액세스가 가능합니다

### 하려고 했던 작업은 Nginx 이미지에 React, Express를 동시에 서비스하고 싶었다. 발생한 문제점에 대해서 기록해보려고 합니다.


처음 작성했던 docker compose 코드는 아래와 같습니다

```yml
services:
  nginx_proxy:
    ...
    ports:
      - 80:80
    ...

  MP-Client:
    ...
    ports:
      - 3000
    ...

  server:
    ...
    expose:
      - 8080
    ...
```

1. expose를 제대로 이해하지 못하고 port와 같은 내념이라고 생각했었습니다.
Express서버는 API문서, DB Management system이 있었는데 외부에서 접근이 안되서 찾아본 결과 port와 expose문제 였습니다 떄문에 expose를 port로 변경했습니다.

\- 퍼블릭 엑세스와 동일한 개념이라고 생각합니다.

2. 컨테이너간의 통신을 제대로 이해하거나 활용하지 못했다 Nginx를 띄우고 build된 React폴더를 마운트 시키는 작업은 어렵지 않았다. 하지만 Nginx컨테이너와 Express컨테이너가 통신을 통해 도메인을 붙히는 작업은 하지 못했다 시도 해봤던 방법은 아래와 같다.