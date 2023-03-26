![](/study/assets/thumbnail_node.png)

# [ FSFilesAdapter ]Parse Error: spawn ps ENOENT

파일을 업로드 할때 pm2에서 해당 오류가 발생한다.
이유는 pm2 start server.js —watch로 실행시켜서 파일이 로컬에 저장될때 충돌이 발생하는 것 같다
해결 방법은 —watch 옵션을 붙히지 않고 pm2 start server.js로 실행 시켰다

발생한 오류

```js
PM2      | Change detected on path files/739250bb4269b8f136a76611b4438c85_image.png for app server - restarting
PM2      | Stopping app:server id:0
PM2      | Error: spawn ps ENOENT
PM2      |     at Process.ChildProcess._handle.onexit (node:internal/child_process:282:19)
PM2      |     at onErrorNT (node:internal/child_process:477:16)
PM2      |     at processTicksAndRejections (node:internal/process/task_queues:83:21) {
PM2      |   errno: -2,
PM2      |   code: 'ENOENT',
PM2      |   syscall: 'spawn ps',
PM2      |   path: 'ps',
PM2      |   spawnargs: [ '-o', 'pid', '--no-headers', '--ppid', 2479 ]
PM2      | }
```
