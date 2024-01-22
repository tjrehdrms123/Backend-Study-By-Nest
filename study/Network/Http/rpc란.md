# RPC란?

Remote Procedure Call(원격 프로시저 호출)의 약자로, 원격 클라이언트에서 서버의 프로시저를 마치 로컬인 것처럼 직접적으로 호출할 수 있게 하는 통신 규약

## MSA with RPC

서비스가 복잡해집에 따라 도메인 별 서비스를 유저 서비스, 랭킹 서비스, 이메일 서비스등 여러개의 서비스가 맞물려서 제공이 됩니다.

위 서비스를 제공하는 언어가 같은 언어가 아닌 다른 언어로 개발되었다고 가정하겠습니다.

- 유저 서비스: JAVA
- 랭킹 서비스: Python
- 이메일 서비스: Node

이떄 보는 `관점`을 `하드웨어적인 서버`로 보는것이 아닌 `작은 서비스`로 보게 되면서 Micro Service Architecture의 개념이 탄생하게 되었습니다.

![content_rpc_msa.png](/study/assets/content_rpc_msa.png)

이때 작은 서비스간 통신을 위한 규칙이 있어야되는데 유저 서버는 [Rest](./Restapi란.md)로 통신하고 이메일 서버는 RPC로 통신하겠다.

위 처럼 통신 프로토콜 중 하나가 RPC입니다.

## RPC 특징

|                       | RPC                                                                                                   | REST                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 무엇인가요?           | 원격 클라이언트에서 서버의 프로시저를 마치 로컬인 것처럼 직접적으로 호출할 수 있게 하는 시스템입니다. | 클라이언트와 서버 간의 정형 데이터 교환을 정의하는 일련의 규칙입니다.                   |
| 용도                  | 원격 서버에서 작업을 수행합니다.                                                                      | 원격 객체에 대한 생성, 읽기, 업데이트 및 삭제(CRUD) 작업을 수행합니다.                  |
| 가장 적합한 사용 사례 | 복잡한 계산이 필요하거나 서버에서 원격 프로세스를 트리거하는 경우                                     | 서버 데이터 및 데이터 구조를 균일하게 노출해야 하는 경우                                |
| 상태 유지 여부        | 상태 유지 또는 무상태                                                                                 | 무상태                                                                                  |
| 데이터 전달 형식      | 서버에서 정의하고 클라이언트에 적용되는 일관된 구조                                                   | 서버에 의해 독립적으로 결정되는 구조. 동일한 API 내에서 여러 형식을 전달할 수 있습니다. |

## gRPC란

gRPC(Google Remote Procedure Call) : Google에서 만든 RPC 프레임워크

![content_rpc_grpc.png](/study/assets/content_rpc_grpc.png)

> gRPC 통신 이미지: proto 타입 기반의 데이터를 요청하고, 받는 모습

`Protocol Buffer`: google 사에서 개발한 구조화된 데이터를 직렬화(Serialization)하는 기법 입니다.

-

```proto
message Person {
  optional string name = 1;
  optional int32 id = 2;
  optional string email = 3;
}
```

```java
Person john = Person.newBuilder()
    .setId(1234)
    .setName("John Doe")
    .setEmail("jdoe@example.com")
    .build();
output = new FileOutputStream(args[0]);
john.writeTo(output);
```

### 유의해야될 점

웹 브라우저는 gRPC 통신을 지원하지 않습니다. 그렇기 떄문에 Proxy Server를 둬서 통신을 해야됩니다.

## 참고

- [the-difference-between-rpc-and-rest](https://aws.amazon.com/ko/compare/the-difference-between-rpc-and-rest/)
- [https://www.youtube.com/watch?v=LAXgizAk9yA](https://www.youtube.com/watch?v=LAXgizAk9yA)
- [https://www.youtube.com/watch?v=KGAernd-42M&t=1291s/](https://www.youtube.com/watch?v=KGAernd-42M&t=1291s/)
