# Nestjs 기본 예제 

## .env
```
#SERVER
PORT=8000

#DB
MONGODB_URL="mongodb+srv://id:pw@url/db_name"
MODE="dev"

JWT_SECRET='JWT_SECRET'

SWAGGER_USER=user
SWAGGER_PASSWORD=password

#SERVER
HOST_URL="http://localhost"
```

## 1. Nest Project init / [nest 생성](https://docs.nestjs.com/first-steps)
```nest cli
$ npm i -g @nestjs/cli
$ nest new project-name
```

## 2. Module, Controllers, Service init / [cli](https://docs.nestjs.com/cli/usages)
```nest cli
nest g mo webtoon
nest g co webtoon
nest g service webtoon
```

## 3. Provider & API
- 컨트롤러에서 서비스코드를 사용할 수 있도록 Providers에 등록
- 서비스 코드에 `WebtoonService`를 의존성 주입해서 컨트롤러에서 사용
```js
@Module({
  providers: [WebtoonService],
})
```

```js
# Controller
@Controller('webtoon')
export class WebtoonController {
  constructor(private readonly webtoonService: WebtoonService) {}
  @Get()
  getAllWebtoon(@Req() request: Request): string {
    return this.webtoonService.allWebtoon();
  }
}
# Service
@Injectable()
export class WebtoonService {
  allWebtoon(): string {
    return 'getAllWebtoon';
  }
}
```

## 4. Middleware
- API 요청에 대한 Logger 미들웨어 생성
- 미들웨어는 NestModule 인터페이스를 구현(implements)해야된다
```nest cli
nest g middleware logger
```

```js
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.logger.log(
        `${req.ip} ${req.method} ${res.statusCode}`,
        req.originalUrl,
      );
    });
    next();
  }
}
```

```js
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
```

## 5. Exception / [exception-filters](https://docs.nestjs.com/exception-filters)
- Client단에서 요청 중 예외가 발생했을때 에러 처리 방식
```js
main.js
app.useGlobalFilters(new HttpExceptionFilter());
```
```js
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse<Response>();
  const request = ctx.getRequest<Request>();
  const status = exception.getStatus();
  const error = exception.getResponse() as | string | { error: string; statusCode: number; message: string | string[] };

  if (typeof error === 'string') {
    response.status(status).json({
    success: false,
    timestamp: new Date().toISOString(),
    path: request.url,
    error,
  });
  } else {
    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      ...error,
    });
  }
  }
}
```
## 6. Interceptors / [interceptors](https://docs.nestjs.com/interceptors)
- Interceptors 예시 Response하기전 데이터를 포맷팅하여 보낸다
```js
@UseInterceptors(SuccessInterceptor)
```
```js
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    );
  }
}
```

## 7. Mongoose DB 설정
```js
npm i @nestjs/mongoose mongoose
npm i @nestjs/config
```

```js
.env
#SERVER
PORT=8000

#DB
MONGODB_URL="mongodb+srv://db:pw@url/db-name"
```

```js
app.module.ts
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    WebtoonModule,
  ],
```

## 8. DB Schema with Mongoose log, Class Validation
```
npm i --save class-validator class-transformer
```

```js
example.schema.ts
const options: SchemaOptions = {
    timestamps: true,
}

@Schema(options)
export class Cat extends Document{
    @Prop({
        required: true,
        unique: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Prop({
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @Prop({
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @Prop()
    @IsString()
    imgUrl: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
```
```js
app.module.ts
export class AppModule implements NestModule {
  # Debug MODE
  private readonly MODE: boolean = process.env.MODE === 'dev' ? true : false;
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    # Mongoose log
    mongoose.set('debug', this.MODE);
  }
}
```
