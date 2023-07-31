# Nestjs에서 Swagger 같은 코드 여러 응답 예시 만들기 - 성공 응답 데코레이터

## 목록
1. [Nestjs에서 Swagger 같은 코드 여러 응답 예시 만들기](./Nestjs%EC%97%90%EC%84%9C%20Swagger%20%EA%B0%99%EC%9D%80%20%EC%BD%94%EB%93%9C%20%EC%97%AC%EB%9F%AC%20%EC%9D%91%EB%8B%B5%20%EC%98%88%EC%8B%9C%20%EB%A7%8C%EB%93%A4%EA%B8%B0.md)
2. [Nestjs에서 Swagger 같은 코드 여러 응답 예시 만들기 - 성공 응답 데코레이터](./Nestjs%EC%97%90%EC%84%9C%20Swagger%20%EA%B0%99%EC%9D%80%20%EC%BD%94%EB%93%9C%20%EC%97%AC%EB%9F%AC%20%EC%9D%91%EB%8B%B5%20%EC%98%88%EC%8B%9C%20%EB%A7%8C%EB%93%A4%EA%B8%B0%20-%20%EC%84%B1%EA%B3%B5%20%EC%9D%91%EB%8B%B5%20%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0.md)
3. [Nestjs에서 Swagger 같은 코드 여러 응답 예시 만들기 - 에러 응답 데코레이터](./Nestjs%EC%97%90%EC%84%9C%20Swagger%20%EA%B0%99%EC%9D%80%20%EC%BD%94%EB%93%9C%20%EC%97%AC%EB%9F%AC%20%EC%9D%91%EB%8B%B5%20%EC%98%88%EC%8B%9C%20%EB%A7%8C%EB%93%A4%EA%B8%B0%20-%20%EC%97%90%EB%9F%AC%20%EC%9D%91%EB%8B%B5%20%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0.md)

## SuccessResponse 데코레이터 만들기 전 확인

value의 객체 참조 주소가 달라합니다. 안그럼 똑같다고 판단되고, 둘중 하나는 사라집니다.

```typescript
@ApiResponse({
  status: 200,
  description: "Success",
  content : {
    'application/json' : {
      example : {
        예시1 : {
          value : CreateDTO,
          description: "Success",
        },
        예시2 : {
          value : CreateDTO,
          description: "Success",
        }
      }
    }
  }
})
```

## Shema 추가

위와 같이 작성하게 되면 `shema`정보가 노출되지 않아 추가로 작성해줘야 됩니다.

스키마를 등록할려면 `$ref`를 통해 클래스의 위치가 어딨는지 가져와야하고,
`ApiExtraModles`를 통해서 디티오 모델을 가져와야됩니다.

수정한 코드는 아래와 같습니다.

```typescript
@ApiExtraModles(ADto,BDto)
@ApiResponse({
  status: 200,
  description: "Success",
  content : {
    'application/json' : {
      example : {
        예시1 : {
          value : CreateDTO,
          description: "Success",
        },
        예시2 : {
          value : CreateDTO,
          description: "Success",
        },
        shema : {
          oneOf: [
            { $ref: getShemaPath(ADto) },
            { $ref: getShemaPath(BDto) }
          ]
        }
      }
    }
  }
})
```

## SuccessCommonResponse.dto.ts

클라이언트로 응답값 떤져줄때 success인터셉터를 통해서 공통응답을 제공해주고있고, data 부분이 각 디티오마다 바뀌는 부분입니다.

[1편](./Nestjs%EC%97%90%EC%84%9C%20Swagger%20%EA%B0%99%EC%9D%80%20%EC%BD%94%EB%93%9C%20%EC%97%AC%EB%9F%AC%20%EC%9D%91%EB%8B%B5%20%EC%98%88%EC%8B%9C%20%EB%A7%8C%EB%93%A4%EA%B8%B0.md)에서 봤듯이 generic 으로 타입을 지정해주면, `makeInstanceByApiProperty` 함수를 통해서 객체를 만들 때 generic 인자로 제네릭 모델 타입을 넘겨주면 data필드부분에 해당 타입으로 객체를 만들어서 리턴해줍니다.

```typescript
// src/common/dtos/SuccessCommonResponse.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SuccessCommonResponseDto<T> {
  @ApiProperty({ type: Boolean, description: '성공여부' })
  @Expose()
  readonly success: boolean;

  @ApiProperty({
    type: 'generic',
    description: 'object 또는 array 형식의 응답데이타가 옵니다.'
  })
  @Expose()
  data: T;
}
```

## SuccessResponse.decorator.ts

### 적용 Example

![](/study/assets/content_nestjs_swagger_customdeco.png)

```typescript
@SuccessResponse(HttpStatus.OK, [SuccessDefine['SUCCESS-1000']])
@ErrorResponse(HttpStatus.BAD_REQUEST, [
  ErrorDefine['ERROR-3000'],
  ErrorDefine['ERROR-3003'],
  ErrorDefine['ERROR-2000'],
])
```

```typescript
// src/common/docorators/SuccessResponse.decorator.ts
import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { SuccessCommonResponseDto } from '../dtos/SuccessCommonResponse.dto';
import { makeInstanceByApiProperty } from '../utils/makeInstanceByApiProperty';
import { mergeObjects } from '../utils/mergeTwoObj';

interface SuccessResponseOption {
  /**
   * 응답 디티오를 인자로받습니다
   * 예시 : ResponseRequestValidationDto
   */
  model: Type<any>;
  /**
   * 예시의 제목을 적습니다
   */
  exampleTitle: string;
  /**
   *  깊은 복사로 변경하고 싶은 응답값을 적습니다. 오버라이트 됩니다.
   *  nested 된 obj 인 경우엔 해당 obj 가 바뀌는것이아닌 안에 있는 property만 바뀝니다.
   *  즉 주어진 객체로 리프 프로퍼티에 대해 오버라이트됩니다.
   */
  overwriteValue?: Record<string, any>;
  /**
   * 어떠한 상황일 때 예시형태의 응답값을 주는지 기술 합니다.
   */
  exampleDescription: string;
  /**
   * 제네릭 형태가 필요할 때 기술합니다.
   * pageDto<generic> 인경우?
   */
  generic?: Type<any>;
}

export const SuccessResponse = (
  StatusCode: HttpStatus,
  succesResponseOptions: SuccessResponseOption[]
) => {
  const examples = succesResponseOptions
    .map((response: SuccessResponseOption) => {
      // base CommonResponse 를 만듭니다.
      const commonResponseInstance = makeInstanceByApiProperty<
        SuccessCommonResponseDto<any>
      >(SuccessCommonResponseDto);

      const DtoModel = response.model;

      // dto 객체를 만든다. 제네릭은 옵셔널 한 값이라 없으면 없는대로 만든다.
      const dtoData = makeInstanceByApiProperty<typeof DtoModel>(
        DtoModel,
        response.generic
      );
      // overWriteValue가 있으면 오버라이트
      // 정보를 좀더 커스텀 할 수있다.
      if (response.overwriteValue) {
        commonResponseInstance.data = mergeObjects(
          {},
          dtoData,
          response.overwriteValue
        );
      } else {
        commonResponseInstance.data = dtoData;
      }

      // 예시 정보를 만든다 ( 스웨거의 examplse)
      return {
        [response.exampleTitle]: {
          value: commonResponseInstance,
          description: response.exampleDescription
        }
      };
    })
    .reduce(function (result, item) {
      Object.assign(result, item);
      return result;
    }, {}); // null 값 있을경우 필터링

  // 스키마를 정의 내리기 위한 함수들
  const extraModel = succesResponseOptions.map(e => {
    return e.model;
  }) as unknown as Type[];
  // 중복값 제거
  const setOfExtraModel = new Set(extraModel);
  // $ref 추가
  const pathsOfDto = [...setOfExtraModel].map(e => {
    return { $ref: getSchemaPath(e) };
  });
  // 제네릭 관련
  const extraGeneric = succesResponseOptions
    .map(e => {
      return e.generic;
    })
    .filter(e => e) as unknown as Type[];
  const pathsOfGeneric = extraGeneric.map(e => {
    return { $ref: getSchemaPath(e) };
  });

  // 데코레이터를 만든다.
  return applyDecorators(
    // $ref를 사용하기 위해선 extraModel 로 등록 시켜야한다.
    ApiExtraModels(...extraModel, ...extraGeneric, SuccessCommonResponseDto),
    ApiResponse({
      status: StatusCode,
      content: {
        'application/json': {
          schema: {
            // 베이스 스키마
            additionalProperties: {
              $ref: getSchemaPath(SuccessCommonResponseDto)
            },
            // dto 스키마들
            oneOf: [...pathsOfDto, ...pathsOfGeneric]
          },
          // 예시값
          examples: examples
        }
      }
    })
  );
};
```

## mergeTwoObj.ts

위 코드에서 `mergeTwoObj`가 사용된 부분은 제네릭넘겨주고 ( null 값이면 makeInstanceByApiProperty에서 알아서 처리를합니다. )
오버라이트 할 값이 있으면 mergeObject 함수를 통해서 깊은 복사, 덮어씌기를 진행한 후에 공통응답 dto 객체에 data에 값을 넣습니다.

깊은복사하는 머지 코드는 스택오버플로우에서 가져와서 사용했습니다.

```typescript
export const mergeObjects = <T extends object = object>(
  target: T,
  ...sources: T[]
): T => {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();
  if (source === undefined) {
    return target;
  }

  if (isMergebleObject(target) && isMergebleObject(source)) {
    Object.keys(source).forEach(function (key: string) {
      if (isMergebleObject(source[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        mergeObjects(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
  }

  return mergeObjects(target, ...sources);
};

const isObject = (item: any): boolean => {
  return item !== null && typeof item === 'object';
};

const isMergebleObject = (item): boolean => {
  return isObject(item) && !Array.isArray(item);
};
```

## SuccessDefine.ts
아래 처럼 성공 응답을 코드화 해서 공통으로 관리를 하고 있습니다.
```typescript
import { ResAnimalTypeDetailNameDto, ResAnimalTypeDto, ResAnimalTypeManyRowDto, ResAnimalTypeNameDto } from 'src/animal_type/dto/response/res_animal_type_dto';
import { SuccessResponseOption } from '../decorators/SuccessResponse.decorator';
type Keys =
  | 'SUCCESS-1000'
  | 'SUCCESS-1001'
  ;

export const SuccessDefine: Record<
  Keys,
  SuccessResponseOption
> = {
  // 1000 : AnimalType
  'SUCCESS-1000': {
    model: ResAnimalTypeDto,
    exampleTitle: '애완동물 타입 생성 성공 예시',
    exampleDescription: '애완동물 타입 생성 성공 예시',
  },
  'SUCCESS-1001': {
    model: ResAnimalTypeNameDto,
    exampleTitle: '애완동물 타입 종류 조회 예시',
    exampleDescription: '애완동물 타입 종류 조회 성공 예시',
  },
};
```

## 참고 링크

- [참고 URL](https://devnm.tistory.com/22)
