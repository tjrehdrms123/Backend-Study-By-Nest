# SOLID 원칙 객체지향

### SOLID의 원칙이란?
> SOLID 원칙들은 소프트웨어 작업에서 프로그래머가 소스 코드가 읽기 쉽고 확장하기 쉽게 될 때까지 소프트웨어 소스 코드를 리팩터링하여 코드 스멜을 제거하기 위해 적용할 수 있는 지침입니다.

## `I ISP`
인터페이스 분리 원칙 (Interface Segregation Principle)
클라이언트가 자신이 이용하지 않는 메서드에 의존하지 않아야 합니다 `클라이언트가 꼭 필요한 메서드`만 이용할 수 있게 합니다.

## ISP 적용 전 예제
```js
interface Skill {
  makeCooike(): void
  makeCake(): void
  makeChicken(): void
}

class CafeStaff implements Skill {
  makeCooike(){}
  makeCake(){}
  makeChicken(){}
}
```
`CafeStaff` 클래스는 `makeCookie`,`makeCake` 메소드만 필요하지만 `makeChicken`메소드도 구현해야된다 이렇게 된다면 추상 메소드 구현 규칙상 오버라이딩은 하되, 메서드 내부는 빈공간으로 두거나 혹은 예외(Exception)을 발생토록 구성해야됩니다.


## ISP 적용 후
```js
interface CafeStaffSkill {
  makeCooike(): void
  makeCake(): void
}
interface ChickenStaffSkill {
  makeChicken(): void
}
class CafeStaff implements CafeStaffSkill {
  makeCooike(){}
  makeCake(){}
}
class CafeStaff implements ChickenStaffSkill {
  makeChicken(){}
}
```
각각의 기능에 맞게 인터페이스를 구성해 해결했습니다.
카페 알바 클래스와 치킨 알바 인터페이스를 분리해 필요한 메소드만 구현할 수 있도록 작업됐습니다.

## ISP 적용 후 이점
- 불필요한 프로퍼티나 메소드 상속 / 구현을 방지해 객체의 필요하지 않은 기능을 어쩔수없이 구현해야하는 낭비를 방지할 수 있습니다.
- 인터페이스와 클래스간의 의존성이 낮아지고 필요에 따라 여러개의 인터페이스를 구현하면서 확장성을 높힐 수 있습니다.