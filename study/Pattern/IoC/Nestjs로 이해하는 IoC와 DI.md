![](https://lime-demo.s3.amazonaws.com/posts/1678377296781_1675076116613_nest.png)

# Nestjs로 이해하는 IoC와 DI

### IoC( 제어 반전, 제어의 반전, 역제어 )

> 프로그래머가 작성한 프로그램이 재사용 라이브러리의 흐름 제어를 받게 되는 소프트웨어 `디자인 패턴`을 말한다라고 설명 되어있습니다.

> IoC디자인 패턴을 구현하는 방법 중 하나의 방법이 `DI`입니다.

### 제어의 역전과 IoC 적용 전 예시 사례

> `제어의 역전`이란 개발자가 관리하던 클래스를 더 이상 관리하지 않고, 프로래그램에 넘기는 것을 의미합니다.

> 적용 전 코드에서는 before class를 프로그래머가 직접 new키워드를 통해 클래스를 인스턴화하여 사용을 해야 했고, before는 TempInstance 객체의 라이프 사이클에는 관여 하고 있다.

```js
# 인스턴스화를 위한 Class
class TempInstance{
  hello(){
    console.log('hello world');
  }
}

# IoC 적용 전 예시 사례
# before의 class는 TempInstance class에 Lifesyc 의존하고있다.
class before{
  instance;
  constructor() {
    this.instance = new TempInstance();
  }
}
const beforeInstance = new before()
beforeInstance.instance.hello()
```

### Nestjs에서의 DI

> 공식문서 : 기본 Nest 클래스는 서비스, 리포지토리, 팩토리, 헬퍼 등 공급자로 취급될 수 있습니다.

> 공식문서에 나온 공급자(provider)는 의존성 주입이 가능하고 의존성 주입이 가능한 클래스는 `@Injectable()` 데코레이터가 있다.

> IoC 적용 후 Nestjs의 예시 사례

> before의 class에서 TempInstance class의 라이프 사이클에는 전혀 관여하지 않는다. Nest가 IoC 컨테이너가 직접 객체의 생명주기를 관리해주기 때문이다.

```js
# TempInstance class는 `@Injectable()` 데코레이터가 있으므로 의존성 주입이 가능한 class이다
@Injectable()
export class TempInstance {
  constructor(
    ...
  ){}
}

# 의존성을 주입하려먼 module에 providers로 등록해줘야된다.
@Module({
  providers: [TempInstance],
})

# providers로 등록된 TempInstance는 아래 예시 처럼 사용할 수 있다.
# 아래의 예시는 생성자 주입 방식으로 사용했다.
export class before {
  constructor(
    private readonly tempInstance: TempInstance,
    )
    ...
}
```

### IoC패턴을 적용 후 이점

> 구현하는 방식과 작업 수행 자체를 분리해서 다음과 같은 이점을 얻을 수 있습니다.

1. 모듈을 제작할 때, 모듈과 외부 프로그램의 결합에 대해 고민할 필요 없이 모듈의 목적에 집중할 수 있습니다
    * 코드 가독성이 높아지고 테스트하기 좋은 코드가 됩니다.
    * 클래스 간 결합이 느슨해집니다.
2. 다른 시스템이 어떻게 동작할지에 대해 고민할 필요 없이, 미리 정해진 협약대로만 동작하게 하면 된다
    * 의존성이 줄어듭니다
3. 모듈을 바꾸어도 다른 시스템에 부작용을 일으키지 않습니다
    * 재사용성이 높은 코드가 됩니다
4. 객체의 라이프 사이클에 신경 쓰지 않아된다.

### 참고 자료

* [https://docs.nestjs.com/providers](https://docs.nestjs.com/providers)
* [https://www.inflearn.com/course/%ED%83%84%ED%83%84%ED%95%9C-%EB%B0%B1%EC%97%94%EB%93%9C-%EB%84%A4%EC%8A%A4%ED%8A%B8/dashboard](https://www.inflearn.com/course/%ED%83%84%ED%83%84%ED%95%9C-%EB%B0%B1%EC%97%94%EB%93%9C-%EB%84%A4%EC%8A%A4%ED%8A%B8/dashboard)
* [https://www.youtube.com/watch?v=8lp_nHicYd4](https://www.youtube.com/watch?v=8lp_nHicYd4)
* [https://ko.wikipedia.org/wiki/%EC%A0%9C%EC%96%B4_%EB%B0%98%EC%A0%84](https://ko.wikipedia.org/wiki/%EC%A0%9C%EC%96%B4_%EB%B0%98%EC%A0%84)