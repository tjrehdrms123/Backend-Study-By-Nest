# Testing AAA, GWT패턴 설명

## Arrange-Act-Assert(AAA) 패턴

`Arrange(준비)`: 테스트에 필요한 초기 상태를 설정합니다.
이 단계에서 테스트하고자 하는 객체나 시스템을 인스턴스화하고 필요한 데이터를 초기화합니다.

`Act(실행)`: 실제로 테스트하고자 하는 동작을 수행합니다.
이 단계에서는 테스트하고자 하는 함수 또는 메서드를 호출하거나, 시스템의 기능을 실행합니다.

`Assert(단언)`: 테스트 결과를 평가하고 예상한 결과와 실제 결과가 일치하는지 확인합니다.
이 단계에서는 테스트 어설션을 사용하여 테스트의 성공 여부를 결정합니다.

## Given-When-Then(GWT) 패턴

`Given(주어진 것)`: 테스트를 실행하기 위해 주어진 초기 상태를 설정합니다.
"Arrange"와 유사하지만, 여기서는 보다 상세하게 테스트 데이터와 객체 상태를 정의합니다.

`When(만일)`: 실제로 테스트하고자 하는 동작을 수행하는 단계입니다.
"Act"와 유사하게, 테스트 대상 함수나 시스템 기능을 호출하거나 실행합니다.

`Then(그러면)`: 테스트 결과를 평가하고 예상한 결과와 일치하는지 확인하는 단계입니다.
"Assert"와 비슷하게, 테스트 어설션을 사용하여 테스트의 성공 여부를 판단합니다.

## Example Testing Code
```js
function addNumbers(a, b) {
    return a + b;
}

function testAddNumbers() {
    // Arrange || Given
    const a = 2;
    const b = 3;
    
    // Act || When
    const result = addNumbers(a, b);
    
    // Assert || Then
    if (result === 5) {
        console.log("Test passed!");
    } else {
        console.error(`Test failed! Expected 5, but got ${result}`);
    }
}

testAddNumbers();
```

## [결론] AAA 패턴과 GWT 패턴
패턴의 이름 자체로도 코드의 의도와 방향성이 다르게 느껴질 수 있기 때문에

저는 두개의 패턴은 `두개의 모자`처럼 개발자가 자신이 작성 또는 수정해야되는 코드를 명확히 구분해 작업할 수 있도록, 하기 위해서 있다고 생각합니다.


- [[마틴 파울러] 리팩토링의 중요성 feat.테스트 코드를 짜는 이유 정리](/study/ETC/Refactoring/%5B%EB%A7%88%ED%8B%B4%20%ED%8C%8C%EC%9A%B8%EB%9F%AC%5D%20%EB%A6%AC%ED%8C%A9%ED%86%A0%EB%A7%81%EC%9D%98%20%EC%A4%91%EC%9A%94%EC%84%B1%20feat.%ED%85%8C%EC%8A%A4%ED%8A%B8%20%EC%BD%94%EB%93%9C%EB%A5%BC%20%EC%A7%9C%EB%8A%94%20%EC%9D%B4%EC%9C%A0%20%EC%A0%95%EB%A6%AC.md)