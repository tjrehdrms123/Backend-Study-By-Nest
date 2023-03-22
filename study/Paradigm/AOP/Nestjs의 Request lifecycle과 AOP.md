![](https://lime-demo.s3.amazonaws.com/posts/1678604862618_nest.png)

# Nestjs의 Request lifecycle과 AOP

### AOP(Aspect-Oriented Programming)관점 지향 프로그래밍

- 선조의 개발자들은 모듈에 비지니스 로직이 아닌 부가 기능이 모듈간 횡단으로 나타나는것에 대해 코드 스멜을 느꼇을 것 같다. 그래서 특점 시점에 부가 기능을 적용하면 좋겠다라고 생각을했을 것 같다. 왜냐하면 위 부가 기능을 수정하려고 했을때 모든 모듈을 수정해줘야 되고, 비지니스 로직 뿐 아니라 부가 기능에 대해서도 신경을 써줘야되기 떄문입니다
- AOP는 모듈에 비지니스 로직이 아닌 인프라 로직이 횡단으로 나타날때 분리를해서 공통으로 적용할 수 있게 하는 프래그램의 패러다임입니다.

> 인프라 로직(부가 기능)

### AOP의 특징과 이점

- 기존에 중복코드를 모듈화 했기 때문에 유지보수가 쉽고, 재사용을 할 수있다.
- 인프라 로직과 비지니스 로직이 분리되기 때문에 비지니스 로직에만 집중할 수 있다.
- 프레임워크에서 AOP를 제공해준다고 한다면, 역할에 맞게 각 레이어를 사용하여 책임을 분리하고 가독성 높고 확장성 있게 개발할 수 있습니다. 개발자들끼리 암묵적인 규칙이 있는것과 같습니다.
  - 예를 들어 Nestjs에서의 예시 규칙은 다음과 같습니다
    - 권한은 `guards (가드)` 레이어에서 체크하자

### AOP를 적용한다면?

> 회원 권한이 Admin인지? 일반 사용자인지 하는 부가 기능이 중복으로 나타난다고 가정해보겠습니다. AOP패러다임을 적용해본다고 하면 아래의 사항을 미리 생각해야 될 것 같습니다.

- Target : 어떤 대상에게 부가 기능을 제공할 것인가?
  - 위 예제에서는 메소드에게 적용되는 부가 기능입니다.
- Advice : 어떤 부가 기능을 제공할 것인가?
  - Admin인지? 일반 사용자인지 하는 부가 기능이 해당된다.
- join point : 어느 시점에 적용할 것인가?
  - 적용되는 지점 또는 시점을 말합니다. (예 : 메소드 진입 전/후, 예외 후, 결과 후)
- point cut : 상세 시점
  - 위와 같은 권한 체크는 Admin 모듈의 메소드의 진입 시점이 point cut이 될 것 입니다.

### Nestjs의 Request lifecycle

> 2023.03.13 Nestjs의 공식문서에 따르면 아래 단계를 거쳐 로직이 수행됩니다.

> `lifecycle의 레이어를 잘 사용한 예시`는 요청 Body에 string타입의 10이 넘어와서 number타입으로 변환해야된다고 가정했을때 Controller에서 형변환해도 문제 없지만 Pipes에서 처리하는게 바람직합니다.

```
0. 요청

1. middleware (미들웨어)

2. guards (가드)

    - 주로 permission (인증) 처리를 할 때 사용합니다.

3. pre-interceptors (인터셉터)

    - 주로 post-interceptor를 위한 변수 선언, 함수 실행을 합니다. (선택)

4. Pipes (파이프)

    - 변환(요청 바디를 원하는 형식으로 변환), 유효성 검사를 합니다.

5. Controller (컨트롤러)

    - 라우터 역할을 수행합니다. (서비스 로직의 결과를 응답합니다.)

6. Service (서비스 ; 컨트롤러 안에 정의되어 있다면)

    - 해당 요청에 대한 핵심 로직이 수행됩니다.

7. post-interceptor (인터셉터)

    - 주로 pre-interceptor 로직을 가지고 응답한 데이터를 가공하거나 전체 로직의 속도를 측정합니다. 최종적으로 성공적인 응답 데이터를 보냅니다.

8. exception filters (필터)

    - 예외 처리를 담당합니다. 에러 메세지를 원하는 형태로 가공해서 응답합니다.

9. 응답
```

### 참고 자료

- [https://docs.nestjs.com/faq/request-lifecycle](https://docs.nestjs.com/faq/request-lifecycle)
- [https://www.youtube.com/watch?v=Hm0w_9ngDpM](https://www.youtube.com/watch?v=Hm0w_9ngDpM)
- [https://www.inflearn.com/questions/265365/filter%EB%8F%84-%EA%B2%B0%EA%B5%AD-middleware%EC%97%90%EC%84%9C-%EC%B2%98%EB%A6%AC%ED%95%A0-%EC%88%98-%EC%9E%88%EC%9D%84%EA%B1%B0-%EA%B0%99%EC%9D%80%EB%8D%B0-%EB%82%98%EB%88%84%EB%8A%94-%EC%9D%B4%EC%9C%A0%EA%B0%80-%EC%9E%88%EC%9D%84%EA%B9%8C%EC%9A%94](https://www.inflearn.com/questions/265365/filter%EB%8F%84-%EA%B2%B0%EA%B5%AD-middleware%EC%97%90%EC%84%9C-%EC%B2%98%EB%A6%AC%ED%95%A0-%EC%88%98-%EC%9E%88%EC%9D%84%EA%B1%B0-%EA%B0%99%EC%9D%80%EB%8D%B0-%EB%82%98%EB%88%84%EB%8A%94-%EC%9D%B4%EC%9C%A0%EA%B0%80-%EC%9E%88%EC%9D%84%EA%B9%8C%EC%9A%94)
