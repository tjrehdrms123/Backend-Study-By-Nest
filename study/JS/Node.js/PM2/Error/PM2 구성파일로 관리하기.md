![](/study/assets/thumbnail_node.png)

# PM2 구성파일로 관리하기
PM2를 실행 시킬때 사용되는 옵션을 파일로 관리해서 실행시키는 방법입니다.

- 생성 파일 : pm2-process.json
  - package.json이 있는 곳에 pm2-process.json파일을 생성합니다.
- 실행 방법 : `pm2 start pm2-process.json`
```json
// Example file
{
  "script": "dist/main.js",
  "watch": true,
  "ignore_watch" : ["node_modules", "logs"],
  "watch_options": {
    "followSymlinks": false
  }
}
```

## [옵션 목록](https://pm2.keymetrics.io/docs/usage/application-declaration/)
```markdown
script: 실행할 메인 파일
watch: 변경사항을 감지해 재시작할 것인지
 - boolean 또는 []
ignore_watch: 변경사항 감지가 `false`가 아닐 경우 감지에 제외할 파일
```