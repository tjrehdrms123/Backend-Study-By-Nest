![](/study/assets/thumbnail_nestjs.png)

# Role 적용하기

## 문제점

API의 사용 권한을 `User`,`Àdmin`으로 나눠야 됐습니다.

## 사전 내용

컴파일 타임에서 런타임으로 넘어갈때 적어놓은 어노테이션으로 메타데이터를 설정할 수 있습니다.

어떠한 클래스나 클래스의 프로퍼티에 키값을 가지고 정보를 저장 할 수 있습니다.

주의할점은 메타데이터가 한번 설정한뒤에 그뒤에 동적으로 변화할 순 없습니다.

## 1. eumn 값을 추가 합니다.

```js
// common/define/EnumDefine.ts
enum Role {
  User = 'User',
  Admin = 'Admin'
}

export {
  Role
}
```

## 2. 유저 엔티티에 권한 컬럼 추가

```js
// users/entities/users.entity.ts
@Column({ type: 'enum', enum: Role, default: Role.User })
@ApiProperty({
  example: 'User',
  description: '유저 권한',
  enum: Role,
})
role: Role;
```

## 3. auth 모듈 생성 후 Admin 가드 생성

Admin 권한 체크 데코레이터 입니다.

```js
// common/decorators/Roles.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { Role } from "../define/EnumDefine";

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

위 코드는 롤들을 인자로 받습니다.
...roles 는 @Roles("Admin" ,"User" ) 처럼 이런형식으로 인자를 넘기면

["Admin" ,"User" ] 로 변환을 해준다고 보면 됩니다.

SetMetadata를 활용해서 "roles" 라는 키에 권한 정보를 저장할 수 있습니다.

이렇게 컨트롤러 메서드나 컨트롤러 클래스에 적어주면 "누가 접근 할수 있는 메소드" 인지에 대한 정보를 얻을 수있다.

```js
// auth/auth.interface.ts
import { Role } from "src/common/define/EnumDefine";

export interface AccessJwtPayload {
  id: number;
  role: Role;
}
```

가드 작성 전 가드에서 중요한 점은 실행 콘텍스트를 가져올 수 있습니다.

현재클라이언트에서 요청한 api의 컨트롤러 클래스와 핸들러 ( 컨트롤러 메소드 ) 에 접근을 할 수있다는 점입니다.

위에서 말했듯이 @Roles() 는 컨트롤러 클래스 에도 , 핸들러에도 적힐 수 있기 때문에

( 컨트롤러 클래스에 적히는경우 모든 해당 컨드롤러의 메소드를 admin레벨로 설정하는 등 )

- 또한 실행컨텍스트를 통해서 클라이언트의 요청 헤더나 바디등에도 접근할수있다! 매우중요 ExecutionContext의 ArgumentHost를 봐라!

네스트에서 주입받은 reflector를 사용하여 ( 가드 생성자에 있다 ) 현재의 실행되고있는 api의 클래스와 메소드 참조값을 넘깁니다.

아마 내부적으론 reflect-metadata 활용해서 해당 참조값에 "roles"라는 키값을 가지고있는 메타데이터를 꺼내옵니다.

이때 getAllOverride 라는 메소드를 사용하고 있는데 이건

우선순위를 생각해서 가령 ( admin 컨트롤러 내부에 진짜 최종 꼭대기 관리자인 superAdmin 이 써야하는 api 가 있다면 )

메소드를 최상위 우선순위로 두고 덮어쓰기를 해야할듯 싶기 떄문에 사용 합니다.

```js
// auth/guards/Role.guards.ts
import { Request } from 'express';
import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/service/Users.service';
import { AuthService } from '../service/auth.service';
import { Role } from 'src/common/define/EnumDefine';
import { ErrorDefine } from 'src/common/define/ErrorDefine';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Read: @NoAuth 사용시 해당 부분에서 AccessTokenGuard 사용 해제시킴 - 비회원을 위해
    const noAuth = this.reflector.get<boolean>('no-auth', context.getHandler());
    if (noAuth) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request, context);
  }

  /**
   * Admin 권한 체크 데코레이터
   * @param request
   * @param context
   * @returns
   */
  private async validateRequest(request: Request, context: ExecutionContext) {
    const checkHeader = request.headers.authorization;
    if (!checkHeader) {
      // Exception: 잘못된 헤더 요청
      throw new UnauthorizedException(ErrorDefine['ERROR-0009']);
    }
    if (Array.isArray(checkHeader)) {
      // Exception: 잘못된 헤더 요청
      throw new UnauthorizedException(ErrorDefine['ERROR-0009']);
    }
    const jwtString = checkHeader.split('Bearer ')[1];

    // Read: 커스텀 데코레이터로 만든 롤을 가져옴, 클래스와 함수 둘다 가져와야함,override 하는이유 ? admin 이 우선 순위를 가져야 하니깐
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass()
    ]);

    // Read: id, role을 가져옴
    const payload = this.authService.verifyAccessJWT(jwtString);

    const user = payload;
    const newObj: any = request;
    newObj.user = user;

    // 롤기반 체크
    if (!roles) {
      return true;
    }
    if (!roles.length) {
      return true;
    } else {
      if (roles.includes(user.role) === true) {
        return true;
      } else if (user.role === Role.Admin) {
        return true;
      } else {
        // Exception: Admin이 아닐 경우 권한 부족
        throw new UnauthorizedException(ErrorDefine['ERROR-0001']);
      }
    }
  }
}
```

## 4. RolesGuard를 적용 했을때 controller 내부에서 Admin 권한 없이 접근할 수 있도록 해주는 데코레이터입니다

```js
// auth/guards/NoAuth.guard.ts
import { SetMetadata } from "@nestjs/common";
export const NoAuth = () => SetMetadata("no-auth", true);
```

## 5. 권한 체크를 위해 JWT를 복호화 해야 됩니다.

authService에 verifyAccessJWT 메소드를 만듭니다.

```js
import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { AccessJwtPayload } from '../auth.interface';
import { JWTType } from 'src/common/define/EnumDefine';
import { ErrorDefine } from 'src/common/define/ErrorDefine';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
  ) {}

  /**
   * jwtToken을 받아 복호화 유저의 Id와 권한(Role)을 반환
   * @param jwtToken: JWT KEY
   * @returns {id, role}
   */
  verifyAccessJWT(jwtToken: string): AccessJwtPayload {
    try {
      // Read: JWT SECRET_KEY를 가져옴
      const secret = this.configService.get(JWTType.ACCESS);

      // Read: 복호화 진행
      const payload = jwt.verify(jwtToken, secret) as (
        | jwt.JwtPayload
        | string
      ) &
        AccessJwtPayload;
      const { id, role } = payload;

      return {
        id,
        role
      };
    } catch (e) {
      if (e.name === 'TokenExpiredError'){
        throw new UnauthorizedException(ErrorDefine['ERROR-0007']);
      } else {
        throw new UnauthorizedException(ErrorDefine['ERROR-0008']);
      }
    }
  }
}
```

## 6. controller에 guard 적용 하기

```js
@Controller('animal_type')
@UseGuards(RolesGuard)
export class AnimalTypeController {
  @Roles(Role.Admin)
  @Post()
  async createAnimalType() {
    ...
  }

  @NoAuth()
  @Get('name')
  async getAnimalTypeName() {
    ...
  }
}
```

## 참고

- [https://devnm.tistory.com/16](https://devnm.tistory.com/16)
