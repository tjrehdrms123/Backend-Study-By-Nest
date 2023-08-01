![](/study/assets/thumbnail_linux.png)

# Ubuntu 16.04 Disk 영구 마운트

### 영구 마운트 작업을 진행하겠습니다

### 영구 마운트 작업

작업 파일 위치 : /etc/fstab
하드 디스크의 UUID를 얻어옵니다.

```shell
ls -l /dev/disk/by-uuid
```

UUID를 얻어와 총 2개의 하드디스크 영구마운트 작업 진행 했습니다

* /dev/sdb1: UUID="e6dcf74b-e815-4031-8ab7-396cf75b9635" TYPE="ext4" PARTUUID="eba53761-c265-8f42-bb63-056a4d8d7370”
* /dev/sdc: UUID="9d04e801-c9f6-4850-bfec-a168a1af9f54" TYPE="ext4”

![](/study/assets/content_liunx_mount.png)