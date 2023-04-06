![](/study/assets/thumbnail_liunx.png)

# Disk 마운트

1. 마운트 할 Disk 확인합니다.

```bash
sudo fdisk -l
```

2. 파티션 생성

```bash
sudo fdisk 파티션 명
```

Command m을 누르면 상세한 도움말을 확인할 수 있습니다.

새로운 파티션을 생성할 경우 n을 누르고 partition type과 partition number, first sector, last sector를 적은 후 w를 입력하여 저장합니다.

3. 파티션 포맷

```bash
# 기존 파티션을 사용하여 마운트 할 경우 포맷을 진행해야됩니다.
# 파티션안에 내용물이 있거나 포맷을 하기 싫을 경우 건너 뛰고 5번 mount작업을 하면 됩니다.
sudo mkfs.ext4 포맷할 파티션 명 #예시: /dev/sdb1
```

4. UUID확인

```bash
sudo blkid
```

5. mount
```bash
# 마운트 할 디렉토리 생성
sudo mkdir 디렉토리명

# 영구 마운트를 위한 작업
etc/fstab 파일에 아래 내용 추가

sudo vi /etc/fstab
UUID=확인한 UUID명 / data/폴더명 ext4 defaults 0 0

# 마운트 적용
sudo mount -a
```

6. 마운트 확인

```bash
df -h
```

참고 : [https://math-coding.tistory.com/125](https://math-coding.tistory.com/125)