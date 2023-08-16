# 멍냥뿌지 Backend<img src="/assets/content_git_readme_logo.png" align=left width="100" alt="Nest Logo" />

> 멍냥뿌지는 자신의 반려동물을 소개하고 반려동물의 QR을 발급해 사용할 수 있습니다.

<br/>

# ✨ 서비스 페이지

[mn.donggeun.co.kr](mn.donggeun.co.kr)

</br>

# 🌿 사용 스택

### Languages

![typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

### Frameworks & Library

![nestjs](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

### Database

![mysql](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

### Cloud

![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)

<br/>

# 🐈 시작 가이드

Application을 빌드 또는 실행하기 위해 필요합니다.

- Node v16.13.1
- NPM v8.1.2
- MariaDB v10.1.13

## Installation

- [.env 샘플](./docs/Env.md)

```bash
$ git@github.com:tjrehdrms123/meongnyangppuji-backend.git
$ cd meongnyangppuji-backend
$ nvm install 16.13.1
$ nvm use 16.13.1
$ npm install
# 자신의 환경에 맞게 .env 구성
```

## Dev

```bash
$ npm run start:dev
```

```bash
# .env
NODE_ENV=development
```

## Production

```bash
$ npm run test:e2e
# 테스트 후 문제 없다면
$ npm run build
```

```bash
# .env
NODE_ENV=production
```

<br/>

# 📚 아키텍쳐

## Project Architecture

```bash
📂 src
├── 📂 animal        # 반려동물 모듈
├── 📂 animal_type   # 반려동물 타입 모듈
├── 📂 common
|   ├── decorators   # 커스텀 데코레이터
|   ├── define       # Swagger 성공, 에러 코드
|   ├── dtos         # 공통 DTO
|   ├── entities
|   ├── exceptions   # exception 필터
|   ├── interceptors # 성공응답 인터셉터
│   └── utils
├── 📂 guardian       # 반려자 모듈
├── 📂 users          # 유저 모듈
├── 📂 qr             # QR 모듈
├── app.controller.ts
├── app.module.ts
└── main.ts
```

## Module Architecture

```bash
📂 example
├── 📂 controller                   # 컨트롤러
│   └── example.controller.ts
├── 📂 dto                          # 공통 응답 DTO
│   ├─── 📂 request                 # 요청 DTO
│   │   └── (method)_example.dto.ts
│   ├─── 📂 response                # 응답 DTO
│   │   └── res_example.dto.ts
│   └── example.dto.ts
├── 📂 entities                     # Entity
│   └── example.entity.ts
├── 📂 infra                        # Repository
│   └── example.repository.ts
├── 📂 service                      # Service
│   └── example.service.ts
└── example.module.ts
```

<br/>

# 📝 문서

## API Docs

Swagger API Docs 문서 입니다.

- [Version 0.0.1](./docs/api/swagger.html)

## Success & Error Code

API response파일을 기준으로 성공과 에러의 코드를 작성하였고, Swagger Docs의 성공, 에러의 대해서 관리하는 파일입니다.

- [Success Code](./src/common/define/SuccessDefine.ts)
- [Error Code](./src/common/define/ErrorDefine.ts)
- [API response](./docs/Swagger.md)

## DB Table

서비스 구현 전 설계한 DB 설계 파일입니다.

- [Version 0.0.1](./docs/DB.md)

## Convention

<details>
  <summary> 구현 </summary>

  <div markdown="1">

### 추가) 새로운 모듈

- Repository -> Service -> Controller 순으로 구현하고 있습니다.
- API를 완성 후 Testing을 통해 동작하는지 파악하고 있습니다.<br/>
  ㄴ 예외가 발생한다면 필요에 따라 처리합니다.(처리하지 않을 경우 `E2E 주석`을 달아 추 후 처리하기 쉽게 주석을 작성합니다.)<br/>
  `// E2E: 테스트에서 삭제된 행에 있는 detail_name값과 동일한 값을 넣었을떄 500에러 발생 -> 하지만 해당 경우는 없을거기 떄문에 발생하면 추 후 예외처리`

### 수정) 리팩토링 / 버그

- `리팩토링`을 진행할때는 버그가 발생해도 수정하지 않고, `버그`가 발생해 수정할때는 코드 리팩토링을 진행하지 않도록 구분해서 작업합니다.
  - [참고: 리팩토링의 중요성](https://github.com/tjrehdrms123/TIL/blob/main/study/ETC/Refactoring/%5B%EB%A7%88%ED%8B%B4%20%ED%8C%8C%EC%9A%B8%EB%9F%AC%5D%20%EB%A6%AC%ED%8C%A9%ED%86%A0%EB%A7%81%EC%9D%98%20%EC%A4%91%EC%9A%94%EC%84%B1%20feat.%ED%85%8C%EC%8A%A4%ED%8A%B8%20%EC%BD%94%EB%93%9C%EB%A5%BC%20%EC%A7%9C%EB%8A%94%20%EC%9D%B4%EC%9C%A0%20%EC%A0%95%EB%A6%AC.md)

### 삭제) 기능삭제

- 기능 삭제시에는 해당 메소드를 사용중인지 확인하고, Entity와 DB Table을 직접 확인해 다른 테이블과 의존성이 있는지 먼저 확인 합니다.

  </div>

</details>

<details>
  <summary> 주석 </summary>
  <div markdown="1">
  
  ### 주석 설정 셋팅
  `TODO Highlight` Extension을 사용해 아래의 문서의 JSON을 `settting.json`에 추가합니다.
  - [TODO Highlight](./docs/Highlight.md)

### Read: `핵심 로직`이거나 주석이 있을때 `가독성이 상승하는 로직`에는 다음과 같이 주석을 작성합니다.

```typescript
// Read: JWT 토근 발급(토큰을 복호화했을때 유저의 ID가 나옵니다.)
const jwt = await this.jwtService.signAsync(
  { user_id: user.id },
  { secret: this.configService.get('SECRET_KEY') },
);
```

### E2E: `테스팅 후` 오류가 발생하거나 추 후 수정이 필요할때 다음과 같이 주석을 작성합니다.

```typescript
// E2E: 테스트에서 삭제된 행에 있는 detail_name값과 동일한 값을 넣었을떄 500에러 발생 -> 하지만 해당 경우는 없을거기 떄문에 발생하면 추 후 예외처리`
```

### Method: `CRUD` 작업인 경우는 아래와 같이 주석을 답니다.

```typescript
/**
 * POST: 반려동물 종류 등록
 * @param animalTypeData: 생성 정보
 * @returns
 */
```

### Exception: `예외 처리`는 아래와 같이 주석을 답니다.

- 해당 코드는 보통 `Service Layer`에서 처리합니다.

```typescript
// Exception: 동일한 반려동물이 존재할 시
const exceptionExitsAnimalType =
  await this.animalTypeRepository.findOneByDetailName(detail_name);
if (exceptionExitsAnimalType) {
  throw new BadRequestException(ErrorDefine['ERROR-1000']);
}
```

### FEAT: `기능 구현이 필요한 경우` 다음과 같이 주석을 작성합니다.

```typescript
// FEAT: 반려자 삭제 기능 구현이 필요합니다.
```

### MODIF: `기능 변경이 필요한 경우` 다음과 같이 주석을 작성합니다.

```typescript
// MODIF: 반려자 삭제 기능 변경이 필요합니다.
```

### ERROR: `기능 오류가 발생한 경우` 다음과 같이 주석을 작성합니다.

```typescript
// ERROR: 유저 삭제 후 생성시 오류 발생 원인은(SoftDelete로 예상).
```

  </div>
</details>

<details>
  <summary> 테스팅 </summary>

  <div markdown="1">

### E2E

모듈별로 테스트하기 위해 `package.json`에 다음과 같이 셋팅을 진행 합니다.

```json
"scripts": {
  ...
  "test:e2e": "jest --config ./test/test/test-jest-e2e.json",
}
```

`테스트 객체`를 만들떄는 아래와 같이 `testData` 프로퍼티를 통해 필요한 테스트 객체를 만들고 있습니다.

```typescript
const testData = {
  name: "강아지",
  detailName: "푸들",
  animalType: {},
  ...
};

testData.animalType = {
  name: testData.name,
  detail_name: testData.detailName
};
```

  </div>
</details>

</br>

# 📢 해결한 이슈 & 알게된 것

- [Nestjs에서 Swagger 같은 코드 여러 응답 예시 만들기](https://github.com/tjrehdrms123/TIL/blob/main/study/JS/Node.js/Nest.js/Utility/Swagger/Nestjs%EC%97%90%EC%84%9C%20Swagger%20%EA%B0%99%EC%9D%80%20%EC%BD%94%EB%93%9C%20%EC%97%AC%EB%9F%AC%20%EC%9D%91%EB%8B%B5%20%EC%98%88%EC%8B%9C%20%EB%A7%8C%EB%93%A4%EA%B8%B0.md)
  - [Nestjs에서 Swagger 같은 코드 여러 응답 예시 만들기 - 성공 응답 데코레이터](https://github.com/tjrehdrms123/TIL/blob/main/study/JS/Node.js/Nest.js/Utility/Swagger/Nestjs%EC%97%90%EC%84%9C%20Swagger%20%EA%B0%99%EC%9D%80%20%EC%BD%94%EB%93%9C%20%EC%97%AC%EB%9F%AC%20%EC%9D%91%EB%8B%B5%20%EC%98%88%EC%8B%9C%20%EB%A7%8C%EB%93%A4%EA%B8%B0%20-%20%EC%84%B1%EA%B3%B5%20%EC%9D%91%EB%8B%B5%20%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0.md)
  - [Nestjs에서 Swagger 같은 코드 여러 응답 예시 만들기 - 에러 응답 데코레이터](https://github.com/tjrehdrms123/TIL/blob/main/study/JS/Node.js/Nest.js/Utility/Swagger/Nestjs%EC%97%90%EC%84%9C%20Swagger%20%EA%B0%99%EC%9D%80%20%EC%BD%94%EB%93%9C%20%EC%97%AC%EB%9F%AC%20%EC%9D%91%EB%8B%B5%20%EC%98%88%EC%8B%9C%20%EB%A7%8C%EB%93%A4%EA%B8%B0%20-%20%EC%97%90%EB%9F%AC%20%EC%9D%91%EB%8B%B5%20%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0.md)
- [관습적 추상화](https://github.com/tjrehdrms123/TIL/blob/main/study/Codereview/%EA%B4%80%EC%8A%B5%EC%A0%81%20%EC%B6%94%EC%83%81%ED%99%94.md)
- [Class-Validation 응답 key value 형태로 내보내기](https://github.com/tjrehdrms123/TIL/blob/main/study/JS/Node.js/Nest.js/Utility/Class-Validation%20%EC%9D%91%EB%8B%B5%20key%20value%20%ED%98%95%ED%83%9C%EB%A1%9C%20%EB%82%B4%EB%B3%B4%EB%82%B4%EA%B8%B0.md)
- [MySQL 스토리지 엔진](https://github.com/tjrehdrms123/TIL/blob/main/study/Database/Basic/%EC%8A%A4%ED%86%A0%EB%A6%AC%EC%A7%80%20%EC%97%94%EC%A7%84.md)
