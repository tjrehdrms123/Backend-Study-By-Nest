![](/study/assets/thumbnail_docker.png)

# Docker 설치
```
# 엡데이트 
sudo apt update
sudo apt upgrade

# https기반 저장소(repository) 접근하기 위한 도구들 설치
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# key 받아오기
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# docker 저장소 추가
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

sudo apt install docker-ce

# sudo 없이 docker 실행 준비
sudo usermod -aG docker $USER
```