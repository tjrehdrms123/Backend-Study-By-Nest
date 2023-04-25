# 라라벨에서 DI사용 방법
먼저, 해당 Controller 파일을 생성합니다. 예를 들어, UserController라는 파일을 생성한다면, 다음과 같이 Artisan CLI를 사용하여 파일을 생성할 수 있습니다.

```
php artisan make:controller UserController
```

생성된 UserController 파일에서, 사용할 Model 클래스를 import합니다. 예를 들어, User 모델 클래스를 사용한다면, 다음과 같이 import합니다.
```
use App\Models\User;
```

생성된 UserController 클래스 내에서, 생성자 메서드를 추가합니다. 생성자 메서드는 해당 Controller 클래스가 인스턴스화될 때 호출되는 메서드입니다. 이 생성자 메서드에서, 필요한 Model 클래스를 인수로 전달하고, 해당 Model 클래스를 클래스 프로퍼티에 할당합니다.
```php
class UserController extends Controller
{
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    // ...
}
```

생성자 메서드에서 전달된 Model 클래스는 해당 Controller에서 사용할 수 있게 됩니다. 예를 들어, index 메서드에서 모든 사용자를 조회하기 위해 User 모델 클래스의 all 메서드를 사용할 수 있습니다.
```php
public function index()
{
    $users = $this->user->all();
    return view('users.index', compact('users'));
}
```

이와 같이 생성자 주입 방식을 사용하면, 해당 Controller 클래스에서 사용할 Model 클래스를 간단하게 주입하여 사용할 수 있습니다. 이 방식은 의존성 주입(Dependency Injection) 원칙을 따르며, 코드의 가독성과 유지보수성을 높여줍니다.

### 예제
```php
use App\Models\SalesMenuses as SalesMenusesModel;

class SalesMenuses extends Controller
{
    protected $SalesMenusesModel;

    public function __construct(SalesMenusesModel $SalesMenusesModel)
    {
        $this->SalesMenusesModel = $SalesMenusesModel;
    }
		public function index()
    {
        return $this->SalesMenusesModel->index();
    }
}
```