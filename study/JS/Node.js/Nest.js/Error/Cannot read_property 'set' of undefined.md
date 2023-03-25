![](/study/assets/thumbnail_nestjs.png)

# Mongoose UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'set' of undefined

위 에러는 mogoose 버전 문제입니다.
mongoose 버전 6으로 올라가면서 nest의 8버전과 populate 관련 충돌 나는 부분이 있습니다
`package.json`에서 아래 부분 수정 후 `npm i` 하면 해결됩니다.

```json
"mongoose" : "^5.13.9"
"@nestjs/mongoose" : "^8.0.1"
```
