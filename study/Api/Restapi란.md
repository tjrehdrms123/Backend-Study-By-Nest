## REST API란
> REST란, HTTP를 잘사용하기 위한 `아키텍쳐 스타일` 이고, 자원에 대한 주소를 지정하는 방법 전반을 일컫는다
> HTTP URI(Uniform Resource Identifier)를 통해 자원(Resource)을 명시하고, HTTP Method(POST, GET, PUT, DELETE)를 통해 해당 자원에 대한 CRUD Operation을 적용하는 것을 의미한다.

### CRUD Operation & HTTP Method
```
Create : 생성(POST)
Read : 조회(GET)
Update : 수정(PUT)
Delete : 삭제(DELETE)
HEAD: header 정보 조회(HEAD)
```

### REST API 쉽게 이해하기
> 회원을 생성하는 주소를 만들어야된다고 생각해보자
> 아래 적용전과 같이 만들수도 있지만 ~하기 읽기,수정하기,등록하기,삭제하기와 같은 자원 `회원`의 상태를 변경할떄 HTTP Method를 사용한다.
> 소스 코드도 동일하게 URL기준이 아닌 HTTP Method로 구분하게 변경되었을 것이다.
```js
/* 
    REST 적용 전
    Method : GET
    URL : 127.0.0.1/회원/만들기
*/
    @Get('/회원/만들기')
    async 만들기() {
        ...
    }
/*
    REST 적용 후
    Method : POST
    URL : 127.0.0.1/회원
    
*/
    @Post('/회원')
    async 만들기() {
        ...
    }
```

### Restful
> REST의 원칙을 지키면서 API의 의미를 표현하고 쉽고, 파악하기 쉽게 하는것을 `Restful` 하다고 합니다. 지켜야되는 규칙은 아래와 같습니다.

### REST API 설계 규칙
1. 슬래시 구분자(/)는 계층 관계를 나타내는데 사용한다.
``` http://restapi.example.com/houses/apartments ```
2. URI 마지막 문자로 슬래시를 포함하지 않는다
 - URI에 포함되는 모든 글자는 리소스의 유일한 식별자로 사용되어야 하며 URI가 다르다는 것은 리소스가 다르다는 것이고, 역으로 리소스가 다르며 URI도 달라져야 한다.
``` http://restapi.example.com/houses/apartments/ (x) ```
3. 하이픈(-) 은 URI 가독성을 높이는데 사용
 - 불가피하게 긴 URI 경로를 사용하게 된다면 하이픈을 사용해 가독성을 높인다.
4. 밑줄(_)은 사용하지 않는다.
밑줄은 보기 어렵거나 밑줄 때문에 문자가 가려지기도 하므로 가독성을 위해 밑줄은 사용 x
5. URI 경로에는 소문자가 적합
 - URI 경로에 대문자 사용은 피하도록 한다
6. 파일 확장자는 URI에 포함하지 않는다.

### 참고
 - [https://aws.amazon.com/ko/what-is/restful-api/](https://aws.amazon.com/ko/what-is/restful-api/)