# MVC with Service, Repository 패턴 적용

[Laravel-Service-Repository-Patten.git](https://github.com/tjrehdrms123/Laravel-Service-Repository-Patten)

## 기존 코드의 문제점

1. Model 코드에 모델 컨벤션과, CRUD(생성, 읽기, 업데이트 및 삭제)의 메소드가 있어서 가독성이 떨어졌습니다.

2. 비즈니스 로직에서 데이터베이스에 직접 접근을 하게되는 상황이 발생했었습니다.

3. Model에 어떤 메소드가 구현되어있고, 어떻게 사용해야되는지 알 수 없었습니다. 해당 문제를 해결하기 위해 Interface를 통해 구현 메소드와 사용을 강제시켰습니다.

## Service

- 서비스에서는 비지니스 로직을 수행하며, 데이터의 유효성을 검사합니다.
- 오류가 없다면 `Repository`를 호출합니다.

## Repository

- 트CRUD(생성, 읽기, 업데이트 및 삭제)
- 비즈니스 로직이 있는 Service Layer와 Data Source Layer 사이에서 중재자 역할을 하는
