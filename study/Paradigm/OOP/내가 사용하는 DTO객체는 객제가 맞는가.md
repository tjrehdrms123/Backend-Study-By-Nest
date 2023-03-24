# 내가 사용하는 DTO객체는 객제가 맞는가?

### 메소드가 없는 `DTO`는 객체인가?
> DTO는 Data Transfer `Object` 우선 Object객체입니다. 그런데 난 사용할때 객체의 특성인 상태만 있고 행동 즉 메소드를 구현하지 않았다. 계층간 데이터를 전달할떄 자바의 인터페이스처럼 틀 만 제공해서 메소드가 있을 필요가 없기 때문입니다.
```js
export class TempGetDto extends PickType(Temp, ['id'] as const) {}
```

### 그럼 DTO에 메소드를 추개해야되나?
> 참고한 블로그에 따르면 순수하게 getter/setter만 가진 객체가 DTO라고 말하는 개발자들도 많지만, 간단한 형태변환 정도는 허용하는 개발자들도 존재합니다 DTO도 결국 Object이므로 말이 된다. 적당한 타협이 필요하다.

### 내 생각
> 필자가 사용하는 `Nestjs`는 Request lifecycle에 `Pipes`를 통해서 형태변환을 합니다
이와 다르게 계층의 DTO마다 형 변환을 해주면 나중에는 어디서 형번환이 됐는지? 꼬일 것 같다.
그러므로 상황에 따라서 알맞게 사용해야한다고 생각합니다

### 참고
 - [https://hyeon9mak.github.io/DTO-vs-VO/#-%EA%B2%B0%EB%A1%A0](https://hyeon9mak.github.io/DTO-vs-VO/#-%EA%B2%B0%EB%A1%A0)