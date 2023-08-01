![](/study/assets/thumbnail_nestjs.png)

# Nest.js에서 wiston, moment, classValidaion을 사용해서 로그 생성 및 파일 관리하기

### 1\. 필요한 패키지 설치

```markup
npm install winston winston-daily-rotate-file nest-winston moment moment-timezone
```

### 2\. 개발 들어가기전에 로직 및 기능 설계

> try & catch문에서 catch로 에러가 잡히거나, 로직 exception(예외처리)에 통과히지 못한다면 moment로 오늘 날짜를 알아내고 winston에 오늘 날짜와 에러를 기록한다

### 3\. 필요한 코드 작성

> 파일 위치 : utills/winston.ts
> 설명 : 로그를 남길수있는 파일

```js
import { utilities, WinstonModule } from "nest-winston";
import * as winstonDaily from "winston-daily-rotate-file";
import * as winston from "winston";

const logDir = __dirname + "/../../../logs"; // log 파일을 관리할 폴더

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: "YYYY-MM-DD",
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30, //30일치 로그파일 저장
    zippedArchive: true, // 로그가 쌓이면 압축하여 관리
  };
};

// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.MODE === "production" ? "http" : "silly",
      // production 환경이라면 http, 개발환경이라면 모든 단계를 로그
      format:
        process.env.MODE === "production"
          ? // production 환경은 자원을 아끼기 위해 simple 포맷 사용
            winston.format.simple()
          : winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike(process.env.PROJECT_NAME, {
                prettyPrint: true, // nest에서 제공하는 옵션. 로그 가독성을 높여줌
              })
            ),
    }),

    // info, warn, error 로그는 파일로 관리
    new winstonDaily(dailyOptions("info")),
    new winstonDaily(dailyOptions("warn")),
    new winstonDaily(dailyOptions("error")),
  ],
});
```

> 파일 위치 : utills/momnet.ts
> 파일 설명 : 날짜를 기록하는 파일

```js
import * as moment from "moment-timezone";

export const getToday = () => {
  const DATE = new Date();
  moment.locale("ko"); // 언어 번역
  return moment(DATE).tz("Asia/Seoul").format("MMMM Do YYYY, h:mm:ss a");
};
```

### 4\. ClassValidation로그 처리

> 필자는 nestjs에 classValidaion을 사용했다 classValidaion에서는 제공하는 다양한 기능 중 @IsString과 같은 데코레이터를 사용했을때 string타입으로 넘어오지 않을 경우 자동으로 에러 처리를 해준다 하지만 그 경우에 에러 처리 메세지를 변경하고 싶었다
> 설명 : ClassValidation용 커스텀 에러 처리

```js
/**
 * @param property
 * @param type
 */
export const customMessageConvert = (property: string, type: string) => {
  const message = {
    format: "값은 형식이 옳바르지 않습니다",
    empty: "값이 비어있습니다",
  };
  return `${property} ${message[type]}`;
};
```

> 설명: 스카미 파일
> 세부 설명 : string타입으로 넘어오지 않을 경우 message를 설정해서 커스텀하게 변경 할 수 있다

```js
@IsString({
  message: (args: ValidationArguments) => {
    return customMessageConvert(`${args.property}`,'format');
  }
})
 @IsNotEmpty({
  message: (args: ValidationArguments) => {
    return customMessageConvert(`${args.property}`,'empty');
  }
})
```

### 5. 로그 파일 생성 확인
![image.png](/study/assets/content_nestjs_winston_log.png)