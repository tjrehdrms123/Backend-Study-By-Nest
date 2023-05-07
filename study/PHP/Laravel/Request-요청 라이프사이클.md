# Request-요청 라이프사이클

![life cycle](/study/assets/content_laravel_basic_lifecyle.png)

## 부트스트래핑

라라벨 애플리케이션의 모든 요청에 대한 시작점은 public/index.php 파일입니다.

웹서버 (Apache / Nginx)의 설정에 따라 모든 요청은 이 파일에 전달됩니다.

index.php 파일은 그다지 많은 코드를 가지고 있지 않습니다. 대신 프레임워크의 나머지 부분들을 로딩하기 위한 시작점이 됩니다.

컴포저가 생성 한 오토로더 정의를 로딩합니다.

그리고, bootstrap/app.php 에서 라라벨 애플리케이션의 인스턴스를 가져옵니다.

라라벨 자신의 첫 번째 동작은 서비스 컨테이너 인스턴스를 생성하는 것입니다.

### public/index.php 파일 nginx 웹서버에 설정 예시

```
<VirtualHost *:80>
  ServerName <도메인>
  DocumentRoot <라라벨을 셋팅한 폴더 경로/public>
</VirtualHost>
<Directory <라라벨을 셋팅한 폴더 경로/public> >
</Directory>
```

### public/index.php

```php
# 오토로더를 정의하는 코드
require __DIR__.'/../vendor/autoload.php';

# 라라벨 애플리케이션의 인스턴스를 가져오는 코드
$app = require_once __DIR__.'/../bootstrap/app.php';
```

### bootstrap/app.php

```php
# 라라벨 애플리케이션의 인스턴스를 가져오는 코드
$app = new Illuminate\Foundation\Application(
    # create-project로 생상한 DIR 경로를 가져온다.
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);
```

### vendor/laravel/framework/src/Illuminate/Foundation/Application.php

```php
# 인스턴스 생성시 설정한 경로는 Application의 생성자 함수의 basePath에서 사용됩니다
# 서비스 프로바이더 생성
public function __construct($basePath = null)
{
    if ($basePath) {
        $this->setBasePath($basePath);
    }
    $this->registerBaseBindings();
    $this->registerBaseServiceProviders();
    $this->registerCoreContainerAliases();
}
```

## 커널 생성

Http 커널은 요청을 받아 처리합니다.

Console 커널은 Artisan 명령을 실행합니다.

Exceptions 커널은 애플리케이션의 에러 핸들링과 예외 처리를 담당합니다.

### bootstrap/app.php

```php
$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Console\Kernel::class,
    App\Console\Kernel::class
);

$app->singleton(
    Illuminate\Contracts\Debug\ExceptionHandler::class,
    App\Exceptions\Handler::class
);
```

## 서비스 프로바이더 로딩

애플리케이션의 모든 서비스 프로바이더는 config/app.php 설정 파일의 providers 배열에서 관리됩니다.

라라벨은 이 서비스 프로바이더 목록을 각각 인스턴스화합니다.

> IOC패턴을 사용하고 있으므로 Laravel에서 인스턴스화 해줍니다.

서비스 프로바이더를 인스턴스화한 후 모든 프로바이더에서 register 메서드가 호출됩니다.

다음 모든 프로바이더가 등록되면 각 프로바이더에서 boot 메서드가 호출됩니다.

이는 서비스 프로바이더가 boot 메소드가 실행될 때, 등록되고 사용 가능한 모든 컨테이너 바인딩에 의존할 수 있기 때문입니다.

### vendor/laravel/framework/src/Illuminate/Foundation/Application.php

```php
# 내부적으로 서비스 프로바이더 클래스의 register 메서드를 호출하는 함수
Illuminate\Foundation\Application->register()
```

## 📚 참고

- [https://laravel.kr/docs/9.x/lifecycle](https://laravel.kr/docs/9.x/lifecycle)
- [https://stackhoarder.com/2019/08/04/laravel-%EA%B8%B0%EC%B4%88-3-request-lifecycle/](https://stackhoarder.com/2019/08/04/laravel-%EA%B8%B0%EC%B4%88-3-request-lifecycle/)
