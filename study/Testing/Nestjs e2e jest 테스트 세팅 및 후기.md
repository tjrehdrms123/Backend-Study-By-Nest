![](https://lime-demo.s3.amazonaws.com/posts/1675076116613_nest.png)

# Nestjs e2e 테스트 세팅 및 후기

### 1\. nest의 기본 e2e 스크립트 실행

> 선 작업으로 서버를 실행 시켜야됩니다 `npm run start:dev`

```markup
npm run test:e2e
```

### Cannot find module 에러 발생

> nest에서 모듈을 import할때 상대 경로로 작성했다면 위와 같은 에러가 나올것이다
> 해결 방법은 아래의 파일을 수정해주면된다
> 파일명 : test > jest-e2e.json

```json
{
  ...
  "moduleNameMapper": {
    "^src/(.*)$": "<rootDir>/../src/$1"
  }
}
```

> 파일명 : package.json

```json

"jest": {
    "moduleNameMapper": {
      "src(.*)$": "<rootDir>/src$1"
    },
    ...
}
```

### 2\. 테스트 성공

> 해당 코드는 아래 성공 이미지 중 회원가입에 해당하는 테스트 코드이다
> 참고로 테스트를 진행할때는 실사용 DB에 테스트 데이터가 쌓이지 않도록 테스트용 DB로 테스트하는 것을 권장한다

```js
describe("/user/register : (POST) : 유저회원가입 테스트", () => {
  it("회원가입 성공 테스트", async () => {
    const response = await request(app.getHttpServer())
      .post("/user/register")
      .send({
        email: "e2e@test.com",
        name: "e2e",
        pw: "test",
        introduction: "e2e 테스트 회원입니다",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe("e2e@test.com");
    expect(response.body.data.name).toBe("e2e");
    expect(response.body.data.imgUrl).toBe(
      "https://raw.githubusercontent.com/amamov/teaching-nestjs-a-to-z/main/images/1.jpeg"
    );
    expect(response.body.data.introduction).toBe("e2e 테스트 회원입니다");
    expect(response.body.data.isAdmin).toBe(false);
  });

  it("회원가입 중복 이메일 테스트", async () => {
    const response = await request(app.getHttpServer())
      .post("/user/register")
      .send({
        email: "e2e@test.com",
        name: "e2e2",
        pw: "test2",
        introduction: "e2e2 테스트 회원입니다",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("해당하는 이메일이 이미 존재 합니다.");
    expect(response.body.error).toBe("Unauthorized");
  });
});
```

![](https://lime-demo.s3.amazonaws.com/posts/1675076947431_%C3%AD%C2%85%C2%8C%C3%AC%C2%8A%C2%A4%C3%AD%C2%8A%C2%B8%C3%AC%C2%84%C2%B1%C3%AA%C2%B3%C2%B5.PNG)

### 3\. Try & Catch 개선

```js
try{
    const isUserExist = await this.UserRepository.existsByEmail(email);
    if(isUserExist){
      throw new UnauthorizedException("해당하는 이메일이 이미 존재 합니다.");
    }
catch (error) {
  winstonLogger.error(`${getToday()} signUp: ${error}`);
  throw new PreconditionFailedException("에러가 발생했습니다");
}
```

> 해당 코드는 해당하는 이메일이 존재할 경우 예외 처리를 하는 코드이다
> 테스트코드에서 이메일 값을 넘겨주지 않을 경우 해당 예외처리가 호출될 것으로 예상을 했다 하지만 예외가 if문을 타지 않고, catch로 넘어갔다.
> POSTMAN에서는 원하는 예외처리인 UnauthorizedException가 호출되었지만, jest에서는 PreconditionFailedException가 호출 되었다 그래서 위의 코드를 아래의 코드로 리팩토링 하였다 예외처리를 한곳 이후 부터 try & catch로 잡지 못한 에러를 잡아 주었다

```js
const isUserExist = await this.UserRepository.existsByEmail(email);
if(isUserExist){
  throw new UnauthorizedException("해당하는 이메일이 이미 존재 합니다.");
}
try{
...do something
catch (error) {
  winstonLogger.error(`${getToday()} signUp: ${error}`);
  throw new PreconditionFailedException("에러가 발생했습니다");
}
```

### 4\. 테스트 후기

> 아래의 강의 윤상석 선생님께서 테스트가 없다면 눈을 가리고 달리는것과 같다고 말씀해주셨다 처음에는 이해가 안됐는데 코드를 작성하고 테스트를 해보니 이해가 됐다
> 테스트를 하면서 QA가 코드내에서도 가능하구나\~라는 것을 알게되었다

### 참고

[참고 URL](https://www.inflearn.com/course/%ED%83%84%ED%83%84%ED%95%9C-%EB%B0%B1%EC%97%94%EB%93%9C-%EB%84%A4%EC%8A%A4%ED%8A%B8)
