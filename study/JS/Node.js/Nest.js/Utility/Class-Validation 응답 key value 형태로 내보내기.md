# Class-Validation 응답 key value 형태로 내보내기

## 문제점

초기 작성 코드에서 `Class-Validation`의 에러가 발생하면 아래와 같이 한줄로 표시되어, Front에서 처리하기 어려움이 있을것으로 예상이 되었습니다.

## before 응답

```json
{
  "timestamp": "2023-08-13T10:28:41.843Z",
  "path": "/animal",
  "method": "POST",
  "error": {
    "message": "소개를 입력해주세요.,나이를 입력해주세요.,나이를 입력해주세요.,프로필 이미지를 선택해주세요.,입력한 ID가 옳바르지 않습니다.",
    "error": "BadRequestException",
    "statusCode": 400
  }
}
```

원하는 형태는 어떤 프로퍼티에 어떤 검증 에러가 발생했는지 `key-value 형태`로 표시되는 형태를 원했습니다.

## 코드 수정

`main.ts` 파일에서 `useGlobalPipes`를 등록해 응답 형식을 변화해야됩니다.

```typescript
this.server.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    exceptionFactory: (errors) => {
      const validationErrors = {};
      errors.forEach((error) => {
        const constraints = error.constraints;
        if (constraints) {
          validationErrors[error.property] = Object.values(constraints);
          // 에러 객체의 속성 (property)을 키로 사용하여, 해당 속성의 제약 조건 메시지들을 배열로 만들어 저장합니다.
          // 예를 들어, 'age' 필드에 대한 에러가 있다면, validationErrors['age']에 해당 에러 메시지를 배열로 저장합니다.
        }
      });
      return new BadRequestException(validationErrors);
    },
  })
);
```

## 코드 리뷰

위의 코드에서 중점적 봐야되는 부분은 `constraints`를 통해 형식을 변경하고 있기 때문에 `constraints`가 어떤 값을 가지고 있고, 무엇인지 알아야합니다.

> constraints는 class-validator 라이브러리에서 사용되는 개념으로, 유효성 검사 규칙에 설정된 제약 조건들을 나타내는 정보입니다.

유효성 검사에서 어떤 필드에 대해 제약 조건이 설정되면, 해당 필드에서 발생하는 에러 객체에는 constraints 속성이 포함될 수 있습니다.

constraints 속성은 해당 필드에 적용된 제약 조건의 이름을 키로, 그에 해당하는 에러 메시지를 값으로 가지게 됩니다.

예를 들어, 다음과 같은 유효성 검사 규칙이 있다고 가정해보겠습니다.

```typescript
import { IsNotEmpty, IsInt } from "class-validator";

class CreateUserDto {
  @IsNotEmpty({ message: "이름을 입력해주세요." })
  name: string;

  @IsInt({ message: "나이는 숫자여야 합니다." })
  age: number;
}
```

이 경우, constraints 속성이 설정된 에러 객체는 다음과 같이 나타날 수 있습니다:

```json
{
  "property": "name",
  "constraints": {
    "isNotEmpty": "이름을 입력해주세요."
  }
}
```

## after 응답

위와 같이 적용한 후 변경된 응답 메시지 입니다.

```json
{
  "timestamp": "2023-08-13T10:28:41.843Z",
  "path": "/animal",
  "method": "POST",
  "error": {
    "message": {
      "introduction": ["소개를 입력해주세요."],
      "age": ["나이를 입력해주세요."],
      "sex": ["나이를 입력해주세요."],
      "profile_img": ["프로필 이미지를 선택해주세요."],
      "id": ["입력한 ID가 옳바르지 않습니다."]
    },
    "error": "BadRequestException",
    "statusCode": 400
  }
}
```
