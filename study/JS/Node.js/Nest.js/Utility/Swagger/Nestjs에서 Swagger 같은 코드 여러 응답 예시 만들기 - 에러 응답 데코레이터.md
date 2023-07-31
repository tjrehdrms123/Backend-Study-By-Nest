# Nestjs에서 Swagger 성공 응답 예시 만들기

## 목록
1. [Nestjs에서 Swagger 같은 코드 여러 응답 예시 만들기](./Nestjs%EC%97%90%EC%84%9C%20Swagger%20%EA%B0%99%EC%9D%80%20%EC%BD%94%EB%93%9C%20%EC%97%AC%EB%9F%AC%20%EC%9D%91%EB%8B%B5%20%EC%98%88%EC%8B%9C%20%EB%A7%8C%EB%93%A4%EA%B8%B0.md)
2. [Nestjs에서 Swagger 같은 코드 여러 응답 예시 만들기 - 성공 응답 데코레이터](./Nestjs%EC%97%90%EC%84%9C%20Swagger%20%EA%B0%99%EC%9D%80%20%EC%BD%94%EB%93%9C%20%EC%97%AC%EB%9F%AC%20%EC%9D%91%EB%8B%B5%20%EC%98%88%EC%8B%9C%20%EB%A7%8C%EB%93%A4%EA%B8%B0%20-%20%EC%84%B1%EA%B3%B5%20%EC%9D%91%EB%8B%B5%20%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0.md)
3. [Nestjs에서 Swagger 같은 코드 여러 응답 예시 만들기 - 에러 응답 데코레이터](./Nestjs%EC%97%90%EC%84%9C%20Swagger%20%EA%B0%99%EC%9D%80%20%EC%BD%94%EB%93%9C%20%EC%97%AC%EB%9F%AC%20%EC%9D%91%EB%8B%B5%20%EC%98%88%EC%8B%9C%20%EB%A7%8C%EB%93%A4%EA%B8%B0%20-%20%EC%97%90%EB%9F%AC%20%EC%9D%91%EB%8B%B5%20%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0.md)

### ErrorCommonResponse.dto.ts

```typescript
// scr/common/dtos/ErrorCommonResponse.dto.ts
import { HttpStatus, Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type as transformerType } from 'class-transformer';

export class ErrorCommonResponse<T> {

  @ApiProperty({ type: String, description: '에러 발생시간' })
  @Expose()
  readonly timestamp: Date;

  @ApiProperty({ type: String, description: '에러 발생 url' })
  @Expose()
  readonly path: string;

  @ApiProperty({ type: String, description: '에러 발생 메소드' })
  @Expose()
  readonly method: string;

  @ApiProperty({
    type: 'generic',
    description:
      'HttpExceptionErrorResponseDto,ValidationErrorResponseDto 두가지가 올수있습니다.'
  })
  @Expose()
  error: T;
}
```

공통응답 디티오이다. error 안에 HttpExceptionErrorResponseDto , ValidationErrorResponseDto 두개가 올수있습니다.

HttpExceptionErrorResponseDto 는 HttpException을 extends 한 에러들의 응답 디티오이다.

error 는 제네릭 형태이지만 제네릭이 컴파일 타임에 타입만 도와주는거라 실제로 타입정보를 얻어올수가없습니다.

따라서 type을 그냥 문자열 generic으로 적고 makeInstanceByApiProperty 함수에서 별도로 처리를 진행 했습니다.

## HttpExceptionError.response.dto.ts

```typescript
// src/common/dtos/HttpExceptionError.response.dto.ts
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { EnumToArray } from '../utils/enumNumberToArray';
import { HttpErrorNameEnum } from './error/HttpErrorNameEnum';

export class HttpExceptionErrorResponseDto {
  @ApiProperty({
    enum: HttpErrorNameEnum,
    description: '에러명'
  })
  @Expose()
  error: string;

  @ApiProperty({
    type: String,
    description: '에러메시지'
  })
  @Expose()
  message: string;

  @ApiProperty({
    enum: EnumToArray(HttpStatus),
    description: '상태코드 400~500번대만 봐주세용'
  })
  @Expose()
  statusCode: number;

  @ApiProperty({
    type: String,
    description: '에러코드가 넘어옵니다. 널값일 수 있습니다!!!',
    nullable: true
  })
  @Expose()
  code?: string;

  constructor(
    statusCode: number,
    error: string,
    message: string,
    code?: string
  ) {
    this.error = error;
    this.statusCode = statusCode;
    this.message = message;
    this.code = code;
  }
}
```

HttpExceptionErrorResponseDto 는 HttpException을 extends 한 에러들의 응답 DTO입니다.

code를 통해서 에러 코드화를 시킨 부분도 있습니다.

## ValidationErrorResponseDto

```typescript
export class ValidationErrorResponseDto {
  @ApiProperty({
    type: String,
    description: '에러명',
    example: 'ValidationError'
  })
  @Expose()
  error = 'ValidationError';

  @ApiProperty({
    type: String,
    description: '밸리데이션 에러는 코드도 ValidationError입니다.',
    example: 'ValidationError'
  })
  @Expose()
  code = 'ValidationError';

  @ApiProperty({
    type: String,
    description: '에러메시지',
    example: '검증오류'
  })
  @Expose()
  message = '검증오류';

  @ApiProperty({
    type: Number,
    description: '400 검증오류 고정',
    example: 400
  })
  @Expose()
  statusCode = 400;

  @ApiProperty({
    // type: { fieldName: ['errorinfoOfString'] },
    description: '필드 : [에러정보] 형식의 에러정보가 담긴 객체입니다.',
    example: { fieldName: ['errorinfoOfString'] }
  })
  @Expose()
  validationErrorInfo: Record<string, Array<string>>;

  constructor(validationErrorInfo: Record<string, Array<string>>) {
    this.validationErrorInfo = validationErrorInfo;
  }
}
```

검증오류 커스텀 에러 응답 DTO입니다.
validationErrorInfo 에 필드 : ["에러정보", "에러정보2"] 이런형식의 object가 들어갑니다.

## ErrorResponse.decorator.ts

model을 통해서 401 ,400 , 403 등 HttpException 을 extends 한 에러를 인자로 받습니다.

표시될 에러의 제목을 적고, message를 통해서 에러메시지를 적습니다.

code 부분은 에러코드를 기술해서 클라이언트단에서 에러메시지를 커스텀하고싶으면 이 부분을 통해서 하면됩니다.

```typescript
// src/common/decorators/ErrorResponse.decorator.ts
import {
  applyDecorators,
  HttpException,
  HttpStatus,
  Type
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
  refs
} from '@nestjs/swagger';
import { CustomValidationError } from '../dtos/error/ValidationError';
import { ErrorCommonResponse } from '../dtos/ErrorCommonResponse.dto';
import { HttpExceptionErrorResponseDto } from '../dtos/HttpExceptionError.response.dto';
import { ValidationErrorResponseDto } from '../dtos/ValidationError.response.dto';
import { makeInstanceByApiProperty } from '../utils/makeInstanceByApiProperty';

export interface ErrorResponseOption {
  /**
   * HttpException을 extend한 에러 타입을 인자로 받습니다.
   * 예시 : BadRequestException
   */
  model: Type<HttpException>;
  /**
   * 예시의 제목을 적습니다
   */
  exampleTitle: string;
  /**
   * 서비스 레이어에서 적었던 오류 메시지를 기술합니다.
   */
  message: string | Record<string, Array<string>>;
  /**
   * 어떠한 상황일 때 오류가나는지 기술합니다.
   */
  exampleDescription: string;
  /**
   * 에러 코드에 대해 기술합니다.
   */
  code?: string;
}

/**
 * 에러를 손쉽게 적기위한 데코레이터입니다.
 * 기본적으로 status 코드가 같으면 하나밖에 못적기때문에 example을 추가하기위해서 커스텀 하였습니다.
 * @param StatusCode 응답 코드입니다. HttpStatus enum 값을 사용하시면됩니다. 보통사용하시는 BadRequestException은 400번입니다.
 * @param errorResponseOptions ErrorResponseOption[] 같은 코드에 여러 example을 추가하기위한 옵션입니다.
 * @returns
 */
export const ErrorResponse = (
  StatusCode: HttpStatus,
  errorResponseOptions: ErrorResponseOption[]
) => {
  let flagValidationErrorExist = false;
  const examples = errorResponseOptions
    .map((error: ErrorResponseOption) => {
      let innerErrorDto;
      if (error.model === CustomValidationError) {
        flagValidationErrorExist = true;
        if (typeof error.message === 'string') {
          throw Error(
            '검증오류는 넘겨줄때 Record<string, Array<string>> 타입으로 주셔야합니다.'
          );
        }
        innerErrorDto = new ValidationErrorResponseDto(error.message);
      } else {
        if (typeof error.message !== 'string') {
          throw Error('http오류는 넘겨줄때 string 타입으로 주셔야합니다.');
        }
        innerErrorDto = new HttpExceptionErrorResponseDto(
          StatusCode,
          error.message,
          error.model.name,
          error.code
        );
      }
      const commonErrorInstance =
        makeInstanceByApiProperty<ErrorCommonResponse<any>>(
          ErrorCommonResponse
        );
      commonErrorInstance.error = innerErrorDto;
      return {
        [error.exampleTitle]: {
          value: commonErrorInstance,
          description: error.exampleDescription
        }
      };
    })
    .reduce(function (result, item) {
      Object.assign(result, item);
      return result;
    }, {}); // null 값 있을경우 필터링
  //console.log(examples);
  return applyDecorators(
    ApiExtraModels(
      ErrorCommonResponse,
      HttpExceptionErrorResponseDto,
      ValidationErrorResponseDto
    ),
    ApiResponse({
      status: StatusCode,
      content: {
        'application/json': {
          schema: {
            additionalProperties: { $ref: getSchemaPath(ErrorCommonResponse) },
            oneOf: flagValidationErrorExist
              ? [
                  { $ref: getSchemaPath(ValidationErrorResponseDto) },
                  { $ref: getSchemaPath(HttpExceptionErrorResponseDto) }
                ]
              : [{ $ref: getSchemaPath(HttpExceptionErrorResponseDto) }]
          },
          examples: examples
        }
      }
    })
  );
};
```

## ErrorDefine.ts
아래 처럼 에러를 코드화 해서 공통으로 에러관리를 하고 있습니다.
```typescript
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { ErrorResponseOption } from 'src/common/decorators/ErrorResponse.decorator';
type Keys =
  | 'ERROR-0001'
  | 'ERROR-0002'
  ;

export const ErrorDefine: Record<
  Keys,
  ErrorResponseOption & { code: string }
> = {
  // 공통
  'ERROR-0001': {
    model: UnauthorizedException,
    exampleTitle: 'Unauthorized - 권한 부족',
    exampleDescription: '해당 사용자는 권한이 부족합니다.',
    message: '해당 사용자는 권한이 부족합니다.',
    code: 'ERROR-0001'
  },
  'ERROR-0002': {
    model: UnauthorizedException,
    exampleTitle: 'Unauthorized - 접근 불가',
    exampleDescription: 'AccessToken을 입력해주세요.',
    message: 'AccessToken을 입력해주세요.',
    code: 'ERROR-0002'
  },
}
```

## 참고 링크

- [참고 URL](https://devnm.tistory.com/23?category=1258201)
