![](/study/assets/thumbnail_liunx.png)

# hostname 설정하기

### hostname 이해하기

- 우리는 웹사이트를 방문할 때, URL을 입력하곤 한다. 우리가 입력한 URL은 내가 방문하고자 하는 사이트의 서버 IP 주소를 가리킨다.
- IP 주소를 외우고 있는 것은 어렵지만, 이를 쉽게 지칭하는 URL을 외우는 것은 어렵지 않다. `Hostname` 또한 이와 같은 원리에서 작동한다.
- 컴퓨터에 `Hostname` 을 부여하는 행위는 이와 비슷하다. 컴퓨터 내에서 어려운 말로 지칭하고 있는 해당 컴퓨터를 쉽게 인식할 수 있는 별칭을 부여한다.

### Ex)

스테이징 서버의 hostname : staging

개발 서버의 hostname : develop

```bash
# 현재 hostname 확인
hostname

# hostname 변경하기
hostnamectl set-hostname 변경할 이름

# 재부팅 명령어
sudo reboot
```

참고 : [https://www.manualfactory.net/13421](https://www.manualfactory.net/13421)