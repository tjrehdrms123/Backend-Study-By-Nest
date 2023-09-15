# Couldn't create temporary file /tmp/apt.conf 에러

```bash
$ apt update -y

W: GPG 오류: http://us.archive.ubuntu.com/ubuntu bionic-backports InRelease: Couldn't create temporary file /tmp/apt.conf.rVavhs for passing config to apt-key
E: The repository 'http://us.archive.ubuntu.com/ubuntu bionic-backports InRelease' is not signed.
N: Updating from such a repository can't be done securely, and is therefore disabled by default.
N: See apt-secure(8) manpage for repository creation and user configuration details.
```

apt update를 실행했을때 위와 같이 오류가 발생했습니다.

`Couldn't create temporary file` 오류를 확인해 `tmp` 폴더에 권한을 주었습니다.

```bash
$ chmod 777 /tmp
```