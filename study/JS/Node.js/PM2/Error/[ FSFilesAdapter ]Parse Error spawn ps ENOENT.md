![](/study/assets/thumbnail_node.png)

# [ FSFilesAdapter ]Parse Error: spawn ps ENOENT

### 발생한 log
```js
PM2      | Change detected on path files/739250bb4269b8f136a76611b4438c85_image.png for app server - restarting
PM2      | Stopping app:server id:0
PM2      | Error: spawn ps ENOENT
... {
PM2      |   errno: -2,
PM2      |   code: 'ENOENT',
PM2      |   syscall: 'spawn ps',
PM2      |   path: 'ps',
PM2      |   spawnargs: [ '-o', 'pid', '--no-headers', '--ppid', 2479 ]
PM2      | }
```

파일을 업로드 할때 pm2에서 해당 로그를 찾을 수 있었습니다. 파일이 로컬에 저장될때 서버가 재시작 되는 이유는 `—watch` 옵션을 줬기 때문입니다. 

### 해결 방법
처음에 해결 했던 방법 `—watch` 옵션을 붙히지 않고 pm2 start server.js로 실행 시켰다. 하지만 `watch`옵션을 주치 않게 되면, `git`으로 반영하거나 변경된 파일이 있을때 서버를 재시작 해줘야된다. 그래서 찾은 방법은 아래 링크를 참고 해서 `ignore_watch`옵션을 주면 됩니다.
