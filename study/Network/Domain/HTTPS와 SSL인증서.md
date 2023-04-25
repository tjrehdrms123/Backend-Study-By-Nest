## HTTPS와 SSL 인증서
HTTP 및 HTTPS는 OSI (Open Systems Interconnection) 모델과 TCP/IP 모델에서 모두 응용 프로그램 계층(Application Layer)에 속합니다.

이 계층은 사용자 애플리케이션과 네트워크 간의 상호 작용을 담당하며, 데이터를 응용 프로그램 포맷으로 변환하고 프로토콜과 상호 작용하여 데이터를 전송합니다.

### HTTP (Hypertext Transfer Protocol)와 HTTPS (Hypertext Transfer Protocol Secure)
모두 인터넷을 통해 데이터를 전송하는 데 사용되는 프로토콜입니다. 두 프로토콜의 주요 차이점은 HTTPS가 더 안전한 버전의 HTTP입니다.

HTTP를 사용하여 웹사이트를 방문하면, 웹 서버와 브라우저 간에 전송되는 모든 데이터가 평문으로 전송됩니다. 이는 누구든 이 데이터를 가로챈다면, 비밀번호, 신용카드 번호 및 개인 정보와 같은 민감한 정보를 쉽게 읽을 수 있다는 것을 의미합니다.

HTTPS는 암호화를 사용하여 전송되는 데이터를 보호합니다. HTTPS를 사용하여 웹사이트를 방문하면, 브라우저와 웹 서버 간에 전송되는 모든 데이터가 암호화되므로, 제3자가 해당 데이터를 읽거나 수정할 수 없습니다.