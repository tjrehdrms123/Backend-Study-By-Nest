# 내가 사용하는 DTO객체는 객제가 맞는가?

### getter, setter 메소드가 없는 `DTO`는 객체인가?

> DTO는 Data Transfer `Object` 우선 Object객체입니다. 그런데 저는 사용할때 객체의 특성인 상태만 있고 행동 즉 메소드를 구현하지 않았습니다. 계층간 데이터를 전달할떄 틀 만 제공 `값을 검증` 하는 용도로 사용하기 떄문에 메소드가 있을 필요가 없기 때문입니다.

> DTO에 getter, setter가 필요한 이유는 클라이언트 요청에 포함된 데이터를 담아 서버 측에 전달하고, 서버 측의 응답 데이터를 담아 클라이언트에 전달하는 계층간 전달자 역할을 하기 때문입니다.

```js
export class TempGetDto extends PickType(Temp, ['id'] as const) {}
```

### 그럼 DTO에 메소드를 추가해야되나?

> 실무를 하다보면 getter와 setter가 필요없는 위와 같은 경우가 있습니다. 그때는 사용하지 않는 getter와 setter를 선언하기 보다 상황에 따라 알맞게 사용해야된다고 생각합니다.

> 참고한 블로그에 따르면 순수하게 getter/setter만 가진 객체가 DTO라고 말하는 개발자들도 많지만, 간단한 형태변환도 허용하는 개발자들도 존재합니다. 적당한 타협이 필요하다라고 합니다.

### getter/setter에 다른 메소드를 넣을까에 대한 생각

> 위와 같은 상황이라면 필자가 사용하는 `Nestjs`는 Request lifecycle에 `Pipes`를 통해서 형태변환을 할 것 입니다.
> 이와 다르게 계층의 DTO마다 형 변환을 해주면 나중에는 어디서 형번환이 됐는지? 꼬일 것 같습니다.

### 참고

- [https://hyeon9mak.github.io/DTO-vs-VO/#-%EA%B2%B0%EB%A1%A0](https://hyeon9mak.github.io/DTO-vs-VO/#-%EA%B2%B0%EB%A1%A0)
