# Nestjs에서 MSA, Gateway 사용하기

## 📝 MSA(마이크로서비스 아키텍처)

애플리케이션을 작은 독립적인 서비스로 분해하는 소프트웨어 아키텍처이다.

![content_nestjs_msa](/study/assets/content_nestjs_msa.jpeg)

| 범주      | 모놀리식 아키텍처                                                                  | 마이크로서비스 아키텍처                                                                                                                          |
| --------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 설계      | 여러 개의 상호 종속 함수가 있는 단일 코드 베이스입니다.                            | API를 사용하여 서로 통신하는 자율 기능을 갖춘 독립 소프트웨어 구성 요소입니다.                                                                   |
| 개발      | 처음에는 계획이 덜 필요하지만 이해하고 유지하기가 점점 더 복잡해집니다.            | 처음에는 더 많은 계획과 인프라가 필요하지만 시간이 지날수록 관리 및 유지가 쉬워집니다.                                                           |
| 배포      | 전체 애플리케이션을 단일 엔터티로 배포합니다.                                      | 모든 마이크로서비스는 개별 컨테이너식 배포가 필요한 독립적인 소프트웨어 엔터티입니다.                                                            |
| 디버깅    | 동일한 환경에서 코드 경로를 추적합니다.                                            | 여러 마이크로서비스 간의 데이터 교환을 추적하려면 고급 디버깅 도구가 필요합니다.                                                                 |
| 수정      | 작은 변경이 전체 코드 베이스에 영향을 미치므로 더 큰 위험을 초래합니다.            | 전체 애플리케이션에 영향을 주지 않고 개별 마이크로서비스를 수정할 수 있습니다.                                                                   |
| 확장 가능 | 특정 기능 영역에서만 수요가 증가하는 경우에도 전체 애플리케이션을 확장해야 합니다. | 필요에 따라 개별 마이크로서비스를 확장하여 전체 조정 비용을 절감할 수 있습니다.                                                                  |
| 투자      | 초기 투자 비용은 낮지만 지속적인 유지 관리 작업은 늘어납니다.                      | 필요한 인프라를 설정하고 팀 역량을 쌓기 위한 추가 시간 및 비용 투자가 필요하지만 장기적으로는 비용을 절감하고, 유지 관리 및 적응력이 개선됩니다. |

## 📝 Gateway 서버

게이트웨이 서버는 여러 마이크로서비스를 관리하고 외부에서 시스템과의 통신을 조절합니다.

네트워킹 간소화, 보안 설정, 로드 밸런싱, 모니터링 등의 기능을 사용할 수 있습니다.

## 📝 Nest Microservices

gateway 서버는 클라이언트로부터 HTTP로 요청을 받고, 백앤드 API 서버와는 TCP로 통신하는 방식 입니다.

![content_nestjs_msa](/study/assets/content_nestjs_msa02.png)

gateway는 클라이언트로부터 HTTP request를 받아, Command와 Payload로 구성된 객체를 만들어 각각 API 서버로 메시지를 보내는 방식으로 이루어 집니다.

```
CQRS를 같이 도입하여, gateway가 보내는 message를 command로 처리하는 방식으로 구성 하였습니다.
api 서버에서 처리해야할 모든 서비스를 작은 command들로 나누어 준비하고,
gateway에서 받은 메시지는 한개 또는 여러개의 command를 실행 합니다. 이때 sync로 필요한 부분만 먼저 처리하여 response 하고, async로 처리해도 되는 부분들은 이후에 event를 통해 처리 하게 구성 합니다.
```

# 📝 TCP를 이용한 Nest Microservices

## A microservice 서버 생성

쿼리 스트링을 변수로 받아 메시지에 응답하는 서비스를 제공하는 서버를 만듭니다.

```bash
npm i -g @nestjs/cli
nest new nest-hello
cd nest-hello
npm i @nestjs/microservices @nestjs/config
```

### .env 파일 생성

```
MS_PORT=8001
MS_HOST=127.0.0.1
```

### 소스 수정

1. 환경 변수 설정
   - src/config.service.ts

```js
import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = {};

  constructor() {
    this.envConfig.service = {
      transport: Transport.TCP,
      options: {
        host: process.env.MS_HOST,
        port: +process.env.MS_PORT,
      },
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
```

2. 모듈 가져오기
   - app.module.ts

```js
import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

3. 서버 시작 코드 변경
   - main.ts

```js
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from './config.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const config = new ConfigService();
  const options = config.get('service');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    options,
  );
  await app.listen();

  Logger.log(
    `🚀 Application is running on: TCP ${JSON.stringify(options)}`,
    'bootstrap-msa',
  );
}
bootstrap();
```

4. 메세지 수신 하도록 컨트롤러 수정
   - src/app.controller.ts

```js
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'hello' })
  executeHello(name: string): string {
    return `hello ${name}`;
  }
}
```

메시지로 { cmd: 'hello' }, payload로 name 을 받아 'hello 이름' 을 return 하는 API입니다.

## gateway 서버 생성

```bash
npm i -g @nestjs/cli
nest new nest-gateway
cd nest-gateway
npm i @nestjs/microservices @nestjs/config
```

### .env 파일 생성

```
PORT=8800
HELLO_SERVICE_NAME=HELLO_SERVICE
HELLO_SERVICE_HOST=127.0.0.1
HELLO_SERVICE_PORT=8001
```

### 소스 수정

1. 환경 변수 설정
   - config.service.ts

```js
import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = {};

  constructor() {
    this.envConfig.port = +process.env.PORT || 3000;

    this.envConfig.helloService = {
      name: process.env.HELLO_SERVICE_NAME,
      transport: Transport.TCP,
      options: {
        host: process.env.HELLO_SERVICE_HOST,
        port: +process.env.HELLO_SERVICE_PORT,
      },
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
```

2. 서버 시작 코드 변경
   - app.main.ts

```js
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const config = new ConfigService();
  const port = config.get("port");

  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`,
    "bootstrap"
  );
}
bootstrap();
```

3. 프로바이더 구성
   - app.module.ts

```js
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "./config/config.service"; //
import { ClientProxyFactory } from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    //
    ConfigService,
    {
      provide: "HELLO_SERVICE",
      useFactory: (configService: ConfigService) => {
        const options = configService.get("helloService");
        return ClientProxyFactory.create(options);
      },
      inject: [ConfigService],
    },
    //
    AppService,
  ],
})
export class AppModule {}
```

hello microservice 서버에 메시지를 전송할 수 있도록 프로바이더를 구성 합니다.

4. 클라이언트 요청 받아 hello 마이크로서비스와 통신하는 부분 생성
   - app.controller.ts

```js
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
@Controller()
export class AppController {
  constructor(
    @Inject('HELLO_SERVICE')
    private readonly helloProxy: ClientProxy,
  ) {}

  @Get('hello')
  getHello(@Query('name') name: string): Observable<string> {
    return this.helloProxy.send({ cmd: 'hello' }, name);
  }
}
```

getHello 함수에서는 클라이언트로부터 name을 파라미터로 받아,

hello microservices로 데이터를 전송하고 return 받은 결과를 다시 client로 반환합니다.

콘솔에서 gateway로 hello를 호출합니다.

## 하이브리드 microservice server

gateway는 클라이언트로부터 받은 http 요청을 TCP 프로토콜로 변환하여, hello microservice에 api를 호출하고 결과를 받아 결과값을 반환 합니다.

그런데 이 환경으로 api 개발을 진행하려면, gateway 서버와 작업하고 있는 서버 두개 띄우고 양 서버에서 동시에 작업을 해야 합니다.
그래서, 개발하는 서버가 직접 HTTP요청을 받아 자기 자신의 TCP로 메시지를 보내 처리하도록 변경 하겠습니다.

1. 환경 변수파일에 개발 포트 추가
   - .env

```
PORT=8101 #추가

MS_PORT=8001
MS_HOST=127.0.0.1
```

2. 환경 변수 불러오는 코드 변경
   - config.service.ts

```js
import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = {};

  constructor() {
    this.envConfig.port = +process.env.PORT || 3000;  //추가
    this.envConfig.service = {
      transport: Transport.TCP,
      options: {
        host: process.env.MS_HOST,
        port: +process.env.MS_PORT,
      },
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
```

3. 서버 실행 코드에 bootstrap 에 TCP microservice와 http 서비스를 모두 실행할 수 있도록 구성 합니다.
   - main.ts

```js
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const config = new ConfigService();
  const options = config.get("service");
  const port = config.get("port");

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice < MicroserviceOptions > options;
  await app.startAllMicroservices();
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: TCP ${JSON.stringify(
      options
    )} with http ${port} port`,
    "bootstrap-hybrid"
  );
}
bootstrap();
```

4. app.module에 gateway에서와 동일하게 client proxy provider를 설정 합니다.
   - app.module.ts

```js
import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "./config/config.service";
import { ClientProxyFactory } from "@nestjs/microservices";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    ConfigService,
    {
      provide: "HELLO_SERVICE",
      useFactory: (configService) => {
        const options = configService.get("service");
        return ClientProxyFactory.create(options);
      },
      inject: [ConfigService],
    },
    AppService,
  ],
})
export class AppModule {}
```

5. app.controller를 gateway의 app.controller와 동일하게 http 요청을 받을 수 있도록 만듭니다.
   - app.controller.ts

```js
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('HELLO_SERVICE')
    private readonly helloProxy: ClientProxy,
  ) {}

  @MessagePattern({ cmd: 'hello' })
  executeHello(name: string): string {
    return `hello ${name}`;
  }

  // 추가
  @Get('hello')
  getHello(@Query('name') name: string): Observable<string> {
    return this.helloProxy.send({ cmd: 'hello' }, name);
  }
}
```

app.controller는 HTTP의 /hello 요청을 받아 TCP service인 excuteHello로 재전송 합니다.

이렇게 구성하면, 개발중에는 서버 한개만을 띄워놓고 모든 개발을 완료할 수 있습니다.

## 예제 소스 코드

- [https://github.com/tjrehdrms123/nest-msa-gateway](https://github.com/tjrehdrms123/nest-msa-gateway)

## 참고 링크

- [AWS 모놀리식 아키텍처와 마이크로서비스 아키텍처의 차이점은 무엇인가요?](https://aws.amazon.com/ko/compare/the-difference-between-monolithic-and-microservices-architecture/)
- [마이크로 서비스 아키텍처 스타일](https://learn.microsoft.com/ko-kr/azure/architecture/guide/architecture-styles/microservices)
- [MSA, Gateway 그리고 Nest](https://velog.io/@projaguar/MSA-Gateway-%EA%B7%B8%EB%A6%AC%EA%B3%A0-Nest#conclusion)
