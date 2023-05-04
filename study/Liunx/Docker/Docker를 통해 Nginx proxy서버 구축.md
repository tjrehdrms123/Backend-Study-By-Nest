![](/study/assets/thumbnail_docker.png)

# Docker를 통해 Nginx proxy서버 구축
Docker로 컨테이너를 띄웠을때 같은 포트를 사용하지 못합니다.

그렇기 때문에 a.com이 80포트를 사용중이라면 b.com과 같은 도메인을 연결하고 싶을때 b.com:8080과 같이 다른 포트를 사용해야됩니다.

필자는 위와 같은 상황일때 메인 컨테이너가 `HTTP:80 port`의 요청을 받아 도메인이 일치한다면 `응답을 하지 않고` 해당 도메인이 있는 컨테이너로 `요청을 전달` 하도록 구축 할 예정입니다.

## Request life cycle
![](/study/assets/content_docker_reverse_proxy_server.png)
1. 클라이언트가 Nginx Reverse Proxy 서버의 IP 주소와 포트 번호를 사용하여 HTTP 요청을 전송합니다.

2. Nginx Reverse Proxy 서버는 요청을 받은 후, 요청의 URL 경로에 따라서 적절한 웹 서버에 전달합니다.

3. 선택된 웹 서버는 요청을 처리하고, 처리 결과를 Nginx Reverse Proxy 서버에 응답합니다.

4. Nginx Reverse Proxy 서버는 응답을 받은 후, 클라이언트에게 응답을 반환합니다.

## Reverse Proxy
위처럼 클라이언트와 웹 서버 사이에 위치하여 요청을 받아서 그 요청을 다른 서버로 전달하고, 해당 서버로부터 받은 응답을 클라이언트에게 반환하는 서버를 `Reverse Proxy`서버라고 합니다.

리버스 프록시를 사용하면 여러 가지 이점이 있습니다.

예를 들어, 웹 서버의 로드 밸런싱, 캐싱, 보안 등의 역할을 프록시 서버에서 대신 수행할 수 있습니다. 또한, `여러 개의 웹 서버가 있을 때, 하나의 도메인 이름`으로 접근할 수 있도록 지원할 수 있습니다.

이렇게 함으로써, 로드 밸런싱을 통해 각 서버에 대한 트래픽을 분산시키고, 서버의 안정성과 가용성을 높일 수 있습니다.

## 1. 도커 네트워크 생성하기
컨테이너간 네트워크 통신을 위해 네트워크를 생성해야됩니다.

네트워크 통신은 프록시 서버가 도메인이 있는 컨테이너로 요청을 전달할때 통신이 이뤄집니다.

네트워크를 생성하는 방법은 2가지의 방법이 있습니다.

1. Docker가 자동으로 생성한 네트워크를 사용하고, 서비스가 자동으로 할당받은 IP 주소를 사용하도록 설정하는 것입니다.
2. 사용자가 직접 서브넷을 구성한 네트워크를 생성하고, 서비스가 해당 네트워크에서 사용할 IP 주소를 지정하는 것입니다.

1번 방법으로 진행하게되면 애플리케이션을 내릴 때 해당 네트워크가 함께 `삭제` 되지만 2번 방법처럼 직접 네트워크를 생성하면 `삭제 되지 않습니다`.

```bash
docker network create --subnet=<ipaddress>/16 <network_name>
```

해당 명령어를 통해 잘 생성되었는지 확인 합니다.
```bash
docker network ls
# Exaplme : 2671ef4f109f   proxy_network   bridge    local
```

## 2. 테스트 컨테이너 생성
테스트 컨테이너는 `HTTP:80 port`의 요청을 받을 수 있는 옵션 `ports`옵션이 없습니다.
```bash
version: '3.3'

services:
  <name>:
    image: <image>
    container_name: <container_name>
    environment:
      - CHOKIDAR_USEPOLLING=true
    stdin_open: true
    tty: true
    networks:
      <network_name>:
        ipv4_address: <ipaddress>

networks:
  <network_name>:
    external:
      name: <network_name>
```

## 3. main_nginx 컨테이너 생성하기
main_nginx컨테이너는 위에서 설명한 `Nginx Reverse Proxy`입니다.
> 외부 네트워크를 구축하지 않으면 `conf.d 파일 수정 후 반영`할때 네트워크가 삭제됩니다.

- `volumes`: nginx도메인 별로 응답을 처리 할 수 있도록 가상 호스팅 폴더를 매핑시킵니다.
- `networks`: 컨테이너간 통신을 위해 위에서 생성한 네트워크를 연결 시키고 `ipv4 address`를 수동으로 할당합니다.

### virtual host file
`proxy_set_header` 옵션이 있는 이유는 프록시 서버 `main_nginx`에서 하위 컨테이너로 요청을 전달할때 옳바르게 갈 수 있도록 합니다.

```bash
server {
    listen       80;
    server_name  <사용할 도메인>;

    client_max_body_size 40M;

    location / {
        proxy_pass <컨테이너 생성 시 할당 한 ipv4 address>;
        proxy_set_header Host $http_host;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
         root   /usr/share/nginx/html;
    }
}
```

### docker-compose.yml
```yml
version: "3"

services:
  main_nginx:
    image: nginx
    container_name: main_nginx
    ports:
      - "80:80"
    volumes:
      - <conf.d>:/etc/nginx/conf.d/
    restart: always
    networks:
      proxy_network:
        ipv4_address: <ipaddress>

networks:
  proxy_network:
    external:
      name: proxy_network
```

## 점검하기
### 해당 명령어를 통해 잘 생성되었는지 확인 합니다.
```bash
docker ps
```

### 해당 명령어를 통해 IP주소가 잘 부여 되었는지 확인 합니다.
`IPAddress`를 확인하면 됩니다.
```bash
docker inspect <container_name>
```

### 해당 명령어를 통해 컨테이너 내부로 들어가 폴더 마운트가 잘 되었는지 확인 합니다.
```bash
docker exec -it main_nginx /bash
```

### 도메인으로 접속해 컨테이너로 프록시가 잘 이루어지는지 확인 합니다.