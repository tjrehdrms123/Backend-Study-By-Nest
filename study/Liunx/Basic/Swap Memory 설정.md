# Swap Memory 설정하기
Swap Memory란 하드디스크의 일부 용량을 RAM처럼 사용할 수 있게 하는 방법입니다.

스템에 RAM 용량이 부족해도 하드디스크를 활용하여 프로그램을 계속 실행시킬 수 있습니다.

### Q. 엇 그럼 RAM을 추가로 살 필요 없이 Swap Memory만 무한히 늘려주면 되겠네요?
Swap Memory에는 크게 두 가지 단점이 존재합니다.
```
1. 하드디스크는 RAM에 비해 읽기/쓰기 속도가 현저히 느립니다.

Swap Memory를 과도하게 사용하면 컴퓨터가 현저히 느려질 수 있습니다.

2. Swap Memory는 읽기/쓰기 작업이 많이 발생하는데, 이는 하드디스크의 수명을 크게 줄일 수 있습니다.

메모리가 부족할 일이 크게 없다면 Swap Memory를 사용하지 않는 것이 바람직합니다.
```

## Swap 메모리 설정
본격적으로 Ubuntu 20.04 기준으로 Swap Memory를 사용하는 방법에 대해 알아봅시다.

1. 진행하기 전에 하드디스크에 Swap 메모리를 설정할 수 있는 충분한 용량이 있는지 확인하여야 합니다.
하드디스크 용량을 확인하는 명령어는 아래와 같습니다.
```bash
df -h
```

2. free 명령어로 현재 사용하고 있는 메모리와 Swap 메모리를 확인할 수 있습니다.
만약 Swap 영역이 보이지 않거나 0이라면 Swap 메모리가 설정되지 않은 상태입니다.
```bash
free
```

3. Ubuntu에서는 Swapfile을 이용하여 Swap 메모리를 설정할 수 있습니다.
Swapfile을 생성하는 방법은 아래와 같습니다.
아래 명령어는 swapfile이라는 이름으로 2GB의 Swapfile을 생성합니다.
```bash
sudo fallocate -l 2G /swapfile
```

### Q. Swap 메모리는 어느 정도로 설정하는 것이 좋나요?
```
통상 RAM 크기의 2배로 설정하는 것을 추천합니다. 예를 들어 RAM 용량이 1GB라면 Swap 메모리는 2GB로 설정하면 됩니다!
```

다음으로 생성한 Swapfile의 권한을 수정해줍니다. 600은 root 계정만 읽기/쓰기가 가능하다는 의미입니다.
```bash
chmod 600 /swapfile
```

이제 생성한 Swapfile로 Swap Memory를 활성화해봅시다.
```bash
sudo mkswap /swapfile
sudo swapon /swapfile
```

마지막으로 시스템을 재부팅해도 Swap이 적용되도록 합니다. 아래 파일을 텍스트 에디터로 열어주세요.
```bash
sudo vi /etc/fstab
```

그리고 아래 내용을 추가해주세요.
```bash
/swapfile swap swap defaults 0 0
```


free 명령어로 Swap Memory가 잘 할당되었는지 확인해봅시다.