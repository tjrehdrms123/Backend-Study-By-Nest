![](/study/assets/thumbnail_liunx.png)

# Docker 설치

주의 : sudo apt upgrade명령어는 패키지들간의 의존성과 충돌이 날 수 있는 명령어 이므로 사용하지 마십시오.

- `apt-transport-https` : 패키지 관리자가 https를 통해 데이터 및 패키지에 접근할 수 있도록 한다.
- `ca-certificates` : ca-certificate는 certificate authority에서 발행되는 디지털 서명. SSL 인증서의 PEM 파일이 포함되어 있어 SSL 기반 앱이 SSL 연결이 되어있는지 확인할 수 있다.
- `curl` : 특정 웹사이트에서 데이터를 다운로드 받을 때 사용
- `software-properties-common` : *PPA를 추가하거나 제거할 때 사용한다.

```markdown
sudo apt update -y

# https기반 저장소(repository) 접근하기 위한 도구들 설치

sudo apt install apt-transport-https ca-certificates curl software-properties-common -y

# key 받아오기
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# docker 저장소 추가
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" -y

sudo apt install docker-ce -y

# sudo 없이 docker 실행 준비
sudo usermod -aG docker $USER
```