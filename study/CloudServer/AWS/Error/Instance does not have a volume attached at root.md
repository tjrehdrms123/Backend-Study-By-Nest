![](/study/assets/thumbnail_aws.jpg)

# 인스턴스에 메인 볼륨을 연결 시킬때 생기는 오류(Instance does not have a volume attached at root (/dev/sda1))

### 발생 원인

다른 인스턴스에 해당 오류가 나오는 인스턴스의 볼륨을 마운트 후 작업해야될 일 이 생겼다.

볼륨을 해제 후 마운트 및 작업을 완료 후 다시 연결했을 때 해당 에러가 발생했다

![](/study/assets/content_aws_mount_error.png)

### 해결 방법

처음 연결되어있던 디바이스의 명과 동일해야된다

권장 사항 : 루트 볼륨일 경우 디바이스의 이름을 맞춰줘야된다

참고 URL : [https://hoonstudio.tistory.com/210](https://hoonstudio.tistory.com/210)
