# Nestjs에서 Swagger 같은 코드 여러 응답 예시 만들기

Nest.js 애플리케이션에서 Swagger 문서에 대한 응답 예시를 다양하게 생성하는 데에 있어서 문제가 있었습니다.
특히 @ApiProperty 데코레이터를 이용하여 응답 예시를 명시하는데 있어서 다음과 같은 문제들이 발생했습니다

## 발생한 문제점

1. 같은 응답 코드에 여러 개의 응답 스키마를 보여주기 어려움: @ApiProperty로는 한 번에 하나의 응답 스키마만 보여줄 수 있었습니다.

   ```typescript
   @ApiResponse({
       status: 200,
       description: '조회되었습니다.',
       type: AnimalDto
   })
   @ApiResponse({
       status: 200,
       description: '변경되었습니다.',
       type: AnimalDto
   })
   ```

2. 응답 예시를 적을 때 일부만 변경하고 나머지 값들은 모두 기술해야하는 어려움: 공통 부분을 제외하고 바뀌는 부분만 기술하고 싶었지만 모든 값을 일일이 작성해야 했습니다.

3. @ApiProperty로부터 가져온 메타데이터를 통해 새로운 객체를 만드는 작업이 어려움: 예시 응답 객체를 동적으로 생성하는 것이 복잡하고 어려웠습니다.
4. Generic 타입에 대한 지원 부족: Generic 타입이 포함된 응답 스키마를 처리하는데 어려움이 있었습니다.
5. Enum 타입의 처리: Enum 타입에 대한 처리가 어려워서 예시 값의 타입을 정확히 매핑하기 어려웠습니다.

이러한 문제들을 해결하기 위해 `@SuccessResponse`와 `@ErrorResponse`와 같은 `커스텀 데코레이터를 만들고, makeInstanceByApiProperty 함수를 활용하여 메타데이터를 기반으로 동적인 예시 응답 객체를 생성하는 방법을 도입할 예정입니다.

## 커스텀 데코레이터 SuccessResponse, ErrorResponse의 기능

1. 같은 응답코드에 여러 응답 스키마를 보여줄 수 있습니다.
2. 같은 응답코드에 여러 응답 예시를 보여줄 수있습니다.
3. 예시를 적을때에 바꾸고 싶은 값만 적으면 그부분만 바뀌어서 예시를 보여줄 수 있습니다.
4. 공통 응답 부분 까지 보여 줄 수있습니다.
5. 성공응답의경우 페이지네이션응답처럼 제네릭 타입 까지 지원해줘야합니다.

### 적용 Example

![](/study/assets/content_nestjs_swagger_customdeco.png)

```typescript
@SuccessResponse(HttpStatus.OK, [
{
    model: UsersEntity,
    exampleTitle: '유저 조회 성공 예시',
    exampleDescription: '유저 조회 성공 예시',
    overwriteValue: {
    guardian_id: ResGuardianMetaData
    }
}
])
@ErrorResponse(HttpStatus.BAD_REQUEST, [
ErrorDefine['ERROR-3000'],
ErrorDefine['ERROR-3003'],
ErrorDefine['ERROR-2000'],
])
```

## @ApiProperty 동작방식에 대한 이해

@ApiProperty 데코레이터를 통해서 우리가 적어줬던 정보들을 스키마나 , 예시 객체로 바꿔 줄 수있는 건 메타데이터를 이용하기 때문입니다.

```typescript
@ApiProperty({ description: '유저정보들.', type: [UserProfileDto] })
```

위처럼 적어주면 안에 적어준 정보들을 가지고 type 정보나 어레이 형인지, 좀더 부가적으로 처리할 부분을 처리하고 createPrpeortyDecorator로 넘기고 있습니다.

> getEnumType 때문에 value가 숫자형 이넘이면 nubmer 로 value가 스트링이면 string으로 적힙니다.

```typescript
// lib/decorators/api-property.decorator.ts | https://github.com/nestjs/swagger/blob/4688f5958c149e04b7e248b87912bf1cad131baa/lib/decorators/api-property.decorator.ts#L22

// @ApiProperty 데코레이터를 생성하는 함수
export function createApiPropertyDecorator(
  options: ApiPropertyOptions = {},
  overrideExisting = true
): PropertyDecorator {
  // 옵션에서 type과 isArray 속성 추출
  const [type, isArray] = getTypeIsArrayTuple(options.type, options.isArray);
  // 추출한 type과 isArray 속성으로 옵션 업데이트
  options = {
    ...options,
    type,
    isArray,
  };

  // 옵션이 enum 배열인지 확인
  if (isEnumArray(options)) {
    // enum 배열이면 type을 "array"로 변경

    options.type = "array";

    // enum 값들 추출하여 "items" 속성에 할당
    const enumValues = getEnumValues(options.enum);
    options.items = {
      type: getEnumType(enumValues),
      enum: enumValues,
    };
    // 옵션에서 "enum" 속성 제거
    delete options.enum;
  } else if (options.enum) {
    // 단일 enum인 경우, enum 값들 추출하고 "enum"과 "type" 속성에 할당
    const enumValues = getEnumValues(options.enum);

    options.enum = enumValues;
    options.type = getEnumType(enumValues);
  }

  // type이 배열인지 확인
  if (Array.isArray(options.type)) {
    // type이 배열이면 옵션을 정확히 반영하도록 업데이트
    options.type = "array";
    options.items = {
      type: "array",
      items: {
        type: options.type[0],
      },
    };
  }

  // 특정 metakey와 options으로 createPropertyDecorator의 결과 반환
  return createPropertyDecorator(
    DECORATORS.API_MODEL_PROPERTIES,
    options,
    overrideExisting
  );
}
```

createPrpeortyDecorator 에보면 중요한 포인트가 두가지 입니다.
Reflect.defineMetaData 로 두가지의 키값으로 값을 저장하고있습니다.

### DECORATORS.API_MODEL_PROPERTIES_ARRAY

@ApiProperty 데코레이터는 클래스의 필드에만 적을 수 있는 데코레이터인데, properties 라고 값을 가져옵니다.
값을 가져오면서 ...properties 하면서 :propertyKey 형식으로 새로운 값을 API_MODEL_PROPERTIES_ARRAY 키값에 넣어 주고있습니다.

### DECORATORS.API_MODEL_PROPERTIES

각 필드별로 메타데이트럴 정해준것입니다.

defineMetadata 할때 4번째인자로 propertyKey 값을 넘겨줘서 가져올 땐 다음과 같이 꺼내줄것 입니다.

```typescript
Reflect.getMetadata(API_MODEL_PROPERTIES, dtoClass.prototype, fieldName);
```

API_MODEL_PROPERTIES는 @ApiProperty를 적용한 각 필드들에게 인자로 넘겨준 type 등의 정보를 저장합니다. 이를 활용하여 필드의 타입 정보 등을 얻을 수 있습니다.

```typescript
// lib/decorators/helpers.ts | https://github.com/nestjs/swagger/blob/0f971f6939fa11f30fd9c677ffa41b7e3435743a/lib/decorators/helpers.ts#L30
// 속성 데코레이터를 생성하는 함수
export function createPropertyDecorator<T extends Record<string, any> = any>(
  metakey: string,
  metadata: T,
  overrideExisting = true
): PropertyDecorator {
  return (target: object, propertyKey: string) => {
    // 타겟의 메타데이터에서 @ApiProperty 데코레이터가 적용된 속성들의 목록 가져오기
    const properties =
      Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, target) || [];

    // 현재 속성이 목록에 없다면 추가
    const key = `:${propertyKey}`;
    if (!properties.includes(key)) {
      Reflect.defineMetadata(
        DECORATORS.API_MODEL_PROPERTIES_ARRAY,
        [...properties, `:${propertyKey}`],
        target
      );
    }

    // 속성에 대해 이미 존재하는 메타데이터 가져오기
    const existingMetadata = Reflect.getMetadata(metakey, target, propertyKey);

    // 기존 메타데이터가 있는지 확인하고, 덮어쓸지 또는 새로운 메타데이터와 병합할지 결정
    if (existingMetadata) {
      const newMetadata = pickBy(metadata, negate(isUndefined));
      const metadataToSave = overrideExisting
        ? {
            ...existingMetadata,
            ...newMetadata,
          }
        : {
            ...newMetadata,
            ...existingMetadata,
          };

      // 최종 메타데이터를 속성에 저장
      Reflect.defineMetadata(metakey, metadataToSave, target, propertyKey);
    } else {
      // 기존 메타데이터가 없는 경우, 지정된 타입과 제공된 옵션으로 새로운 메타데이터 생성
      const type =
        target?.constructor?.[METADATA_FACTORY_NAME]?.()[propertyKey]?.type ??
        Reflect.getMetadata("design:type", target, propertyKey);

      Reflect.defineMetadata(
        metakey,
        {
          type,
          ...pickBy(metadata, negate(isUndefined)),
        },
        target,
        propertyKey
      );
    }
  };
}
```

## @ApiProperty 메타데이터를 통해 객체만들기

스웨거에 예시응답을 보여줄려면 class 타입이아니라 class타입으로 생성한 객체 ( 생성자가 있는 객체 ), 타입만 같은 객체 ( plain object ) 를 어떻게든 만들어서 값으로 넘겨줘야합니다.

### 구현해야되는 기능

- API_MODEL_PROPERTIES_ARRAY 를 통해서 클래스에 @ApiProperty 적힌 필드목록뽑아오기
- API_MODEL_PROPERTIES 를 통해서 필드의 ApiPropertyOptions 정보 빼오기
- 빼온 정보가지고 타입만 같은 순수 객체 만들어서 반환하기

## makeInstanceByApiProperty 구현하기

### 기능 정리

- 디티오 클래스 타입을 인자로 넘겨주면 @ApiProperty에 적은 값들을 통해서 객체를 만들어 넘겨준다
- @ApiProperty 의 type 으로 적어준 정보를 토대로 형식에 맞게 값을 반환해야합니다.
- generic 타입에 대해서 대응 할 수 있어야합니다.
- type 이 따른 Dto 클래스이면 재귀적으로 호출해서 field : dtoclassinstance 형태로 반환해야합니다.
- type 이 따른 Dto 클래스 array 형이면 재귀적으로 호출해서 field : [dtoclassinstance] 형태로 반환해야합니다.
- type 이 따른 Dto 클래스에 순환참조를 방지위해 Lazy 형이이도 받아올 수 있어야합니다.

```typescript
import { ApiPropertyOptions } from "@nestjs/swagger";

// 스웨거 메타데이터 키
const DECORATORS_PREFIX = "swagger";
const API_MODEL_PROPERTIES = `${DECORATORS_PREFIX}/apiModelProperties`;
const API_MODEL_PROPERTIES_ARRAY = `${DECORATORS_PREFIX}/apiModelPropertiesArray`;

//nest js 에서 사용중인 Type ( 생성자 )객체
export interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

// source form lodash 오브젝트 인지 체킹
function isObject(value) {
  const type = typeof value;
  return value != null && (type == "object" || type == "function");
}

// 기본생성자 인지 체크하느 ㄴ함수
function isFunction(value): value is Function {
  if (!isObject(value)) {
    return false;
  }
  return true;
}

// () => type 형태의 순환참조로 기술했을때 가져오는 함수
function isLazyTypeFunc(
  type: Function | Type<unknown>
): type is { type: Function } & Function {
  return isFunction(type) && type.name == "type";
}

// 원시타입인지 확인
function isPrimitiveType(
  type:
    | string
    | Function
    | Type<unknown>
    | [Function]
    | Record<string, any>
    | undefined
): boolean {
  return (
    typeof type === "function" &&
    [String, Boolean, Number].some((item) => item === type)
  );
}

// Type 인지 확인하는 커스텀 타입 체커
function checkType(object: any): object is Type {
  return object;
}
// ApiPropertyOption에 필드네임까지 추가해서 타입정의
type ApiPropertyOptionsWithFieldName = ApiPropertyOptions & {
  fieldName: string;
};
```

맨위에 키값들은 nestjs 가 메타데이터 키값을 저장하는 실제 const 값이다.

그리고 타입체깅하는 함수들은 propertyType이 타입이 많기 떄문에 가지치기를 해줘야합니다.

가지치기를 위해서 필요한 타입체킹 함수들입니다.

메타 데이터는 아래의 코드에서 가져왔습니다.

```typescript
// src/common/utils/makeInstanceByApiProperty.ts

// 디티오를 리터럴 객체로 선언하고 있습니다.
// dtoClass: type (type은 헬퍼 타입입니다. 네스트에서 공통으로 사용하고 있으며 Function을 생성자 타입으로 쓰지 말라고 하더라고요.)
// 인자를 받아오기 때문에 new dtoClass(); 로 할 수도 있으나 생성자가 이미 존재한다면 에러가 발생합니다.
// API_MODEL_PROPERTIES_ARRAY 키값을 통해서 클래스의 필드명들을 가져옵니다.
// 클래스 자체의 메타데이터를 가져오려면 왼쪽처럼(API_MODEL_PROPERTIES_ARRAY),
// 클래스의 필드 정보를 가져오려면 오른쪽 처럼(API_MODEL_PROPERTIES) 하면 됩니다.

export function makeInstanceByApiProperty<T>(
  dtoClass: Type,
  generic?: Type
): T {
  // 디티오로 생성자를 만들지 않고 해당 타입만 가져옵니다.
  // 생성자에 인자가 들어간 경우 에러가 납니다.
  const mappingDto = {};
  // metadata에서 apiProperty로 저장했던 필드명들을 불러옵니다.
  const propertiesArray: string[] =
    Reflect.getMetadata(API_MODEL_PROPERTIES_ARRAY, dtoClass.prototype) || [];
  // apiProperty로 적었던 필드명 하나하나의 정보를 가져오기 위함입니다.
  const properties: ApiPropertyOptionsWithFieldName[] = propertiesArray.map(
    (field) => {
      // :fieldName 형식이라서 앞에 : 를 짤라줍니다. 위에 createProperty nest 꺼 참조해보면 : 붙임
      const fieldName = field.substring(1);
      // 각 필드마다 메타데이터를 가져옵니다.
      const obj = Reflect.getMetadata(
        API_MODEL_PROPERTIES,
        dtoClass.prototype,
        fieldName
      );
      obj.fieldName = fieldName;
      return obj;
    }
  );
  // mappingDto를 만듭니다. 함수형으로 적을까 했는데... for문 돌렸습니다.
  for (const property of properties) {
    const propertyType = property.type;
    // property.type에 apiProperty에 type을 기술하지 않을 수 있으므로 undefined 체크합니다.
    if (propertyType) {
      // 이건 커스텀임, generic을 위한 커스텀입니다.
      // dto에 T 제네릭으로 들어가는 게 있다면 type을 generic으로 적어주세요.
      if (propertyType === "generic") {
        // generic으로 추가적인 타입이 있다면
        if (generic) {
          // array 형이면 [] 안에 담아서 재귀 호출
          if (property.isArray) {
            mappingDto[property.fieldName] = [
              makeInstanceByApiProperty(generic),
            ];
          } else {
            // 오브젝트 형이면 그냥 바로 호출
            mappingDto[property.fieldName] = makeInstanceByApiProperty(generic);
          }
        }
      } else if (propertyType === "string") {
        // 스트링 형태의 enum
        if (typeof property.example !== "undefined") {
          mappingDto[property.fieldName] = property.example;
        } else {
          mappingDto[property.fieldName] = property.description;
        }
      } else if (propertyType === "number") {
        // 숫자 형태의 enum
        if (typeof property.example !== "undefined") {
          mappingDto[property.fieldName] = property.example;
        } else {
          mappingDto[property.fieldName] = property.description;
        }
      } else if (isPrimitiveType(propertyType)) {
        // 원시 타입 [String, Boolean, Number]
        if (typeof property.example !== "undefined") {
          mappingDto[property.fieldName] = property.example;
        } else {
          mappingDto[property.fieldName] = property.description;
        }
      } else if (isLazyTypeFunc(propertyType as Function | Type<unknown>)) {
        // type: () => PageMetaDto 형태의 lazy
        // 익명 함수를 실행시켜 안에 Dto 타입을 가져옵니다.
        const constructorType = (propertyType as Function)();
        if (Array.isArray(constructorType)) {
          mappingDto[property.fieldName] = [
            makeInstanceByApiProperty(constructorType[0]),
          ];
        } else if (property.isArray) {
          mappingDto[property.fieldName] = [
            makeInstanceByApiProperty(constructorType),
          ];
        } else {
          mappingDto[property.fieldName] =
            makeInstanceByApiProperty(constructorType);
        }
      } else if (checkType(propertyType)) {
        // 마지막 정상적인 클래스 형태의 타입
        if (property.isArray) {
          mappingDto[property.fieldName] = [
            makeInstanceByApiProperty(propertyType),
          ];
        } else {
          mappingDto[property.fieldName] =
            makeInstanceByApiProperty(propertyType);
        }
      }
    }
  }
  return mappingDto as T;
}
```

## 참고 링크

- [참고 URL](https://devnm.tistory.com/21)
