# Nestjs에서 Swagger 성공 응답 예시 만들기

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

위와 같이 작성하게 되면 `shema`정보가 노출되지 않아 추가로 작성해줘야 됩니다.

스키마를 등록할려면 $ref를 통해 클래스의 위치가 어딨는지 가져와야하고,
ApiExtraModles 를 통해서 디티오 모델을 가져와야됩니다.

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
