![](/study/assets/thumbnail_http.png)

# iptime 내부 웹서버 구축

### DDNS 설정이 되어있어야합니다

**1\. 고급설정 \> NAT/라우터 관리에 접속해 웹 서버로 사용할 내부 웹 서버 컴퓨터의 주소와 웹 서버의 포트를 포워딩 시켜줍니다**
**2\. 사전 작업**

* 내부에는 Apache와 같은 웹서버가 당연히 있어야된다.
* 해당 DDNS [iptime DDNS 등록](https://blog.donggeun.co.kr/view/63bcbb5a0146ab9134570526)처럼 DDNS가 설정되어있어야된다.

![](/study/assets/content_etc_iptime_webserver_01.png)

**CNAME 레코드를 설정해서 DDNS설정한 컴퓨터와 연결되도록 합니다**
고정 IP를 사용한다면 A레코드를 사용해도 상관 없습니다
![](/study/assets/content_etc_iptime_webserver_02.png)