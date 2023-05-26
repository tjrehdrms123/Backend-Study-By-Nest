# MVC with Service, Repository 패턴 적용

[Laravel-Service-Repository-Patten.git](https://github.com/tjrehdrms123/Laravel-Service-Repository-Patten)

## 기존 코드의 문제점

1. Model 코드에 모델 컨벤션과, CRUD(생성, 읽기, 업데이트 및 삭제)의 메소드가 있어서 가독성이 떨어졌습니다.

2. 비즈니스 로직에서 데이터베이스에 직접 접근을 하게되는 상황이 발생했었습니다.

3. Model에 어떤 메소드가 구현되어있고, 어떻게 사용해야되는지 알 수 없었습니다. 해당 문제를 해결하기 위해 Interface를 통해 구현 메소드와 사용을 강제시켰습니다.

## Service & Repository
### Service
- `Controller Layer`에서 `Service Layer`를 호출하며 비지니스 로직을 수행하며 데이터를 가공해 `Repository Layer`를 호출한다.

### Repository
- `Service Layer`에서 `Repository Layer`를 호출하며 DB 트랜잭션(CRUD)을 실행한다.

## 초기 셋팅
```bash
# Laravel 프로젝트 생성
laravel new Laravel-Service-Repository-Patten

# Test 모델, 컨트롤러 생성 | 기본 메소드인 리소스 설정
php artisan make:model Test -mcr
```

.env
```bash
# .env에 DB 설정
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_service_repository
DB_USERNAME=root
DB_PASSWORD=
```

## Route
```php
# app\routes\web.php
Route::resource('/test', TestController::class);
```

## Migration
테스트 테이블 생성을 위해 Migration을 준비합니다.
```php
# database\migrations\<data>_create_tests_table.php
public function up()
{
    Schema::create('tests', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->string('content');
        $table->boolean('is_completed')->default(false);
        $table->timestamps();
    });
}
```

Migration을 실행합니다.
```bash
php artisan migrate
```

## Model
tests Model 모델 컨벤션을 정의합니다.

```php
class test extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'content',
        'is_completed'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at'
    ];
}
```

## Repository Interface 생성

수동으로 폴더를 만들고 생성해줘야됩니다.

Repository에서 사용될 메소드를 정의합니다.

```php
# App\Repository\Interface\TestRepositoryInterface.php

<?php

namespace App\Repository;

use App\Repository\Interface\TestRepositoryInterface;
use App\Models\test;

class TestRepository implements TestRepositoryInterface
{
    public function getAllTests()
    {
        return Test::all();
    }
    public function getTestById($id)
    {
        return Test::findOrFail($id);
    }
    public function deleteTestById($id)
    {
        Test::destroy($id);
    }
    public function createTest(array $newTest)
    {
        return Test::create($newTest);
    }
    public function updateTestById($id, array $newTest)
    {
        return Test::whereId($id)->update($newTest);
    }

}
```

## Repository 생성

수동으로 폴더를 만들고 생성해줘야됩니다.

인터페이스에서 정의한대로 구현해줍니다.
```php
# App\Repository\TestRepository.php
<?php

namespace App\Repository;

use App\Repository\Interface\TestRepositoryInterface;
use App\Models\test;

class TestRepository implements TestRepositoryInterface
{
    public function getAllTests()
    {
        return Test::all();
    }
    public function getTestById($id)
    {
        return Test::findOrFail($id);
    }
    public function deleteTestById($id)
    {
        Test::destroy($id);
    }
    public function createTest(array $newTest)
    {
        return Test::create($newTest);
    }
    public function updateTestById($id, array $newTest)
    {
        return Test::whereId($id)->update($newTest);
    }
}
```

## Service 생성

수동으로 폴더를 만들고 생성해줘야됩니다.

DB 트랙잭션을 열고 요청에 맞게 Repository를 호출합니다.

예외가 발생하면 실행한 트랙잭션을 되돌리고(rollback) 예외가 발생하지 않는다면 반영(commit) 합니다.

```php
# App\Service\TestService.php
<?php

namespace App\Service;

use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use InvalidArgumentException;
use App\Repository\TestRepository;
use App\Repository\Interface\TestRepositoryInterface;

class TestService
{
    private TestRepositoryInterface $testRepository;

    /**
     * TestRepository construct
     * @param TestRepositoryInterface $testRepository
     */
    public function __construct(TestRepositoryInterface $testRepository)
    {
        $this->testRepository = $testRepository;
    }

    /**
     * Get All Test Datas.
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function index()
    {
        return $this->testRepository->getAllTests();
    }
    public function create()
    {
    }

    public function edit(Request $request)
    {
    }

    /**
     * Validate test data.
     * Store to DB if there are no errors.
     *
     * @param array $data
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function store($data)
    {
        $validator = Validator::make($data, [
            'title' => 'bail|min:2',
            'content' => 'bail|max:255',
            'is_completed' => 'min:1',
        ]);

        if ($validator->fails()) {
            throw new InvalidArgumentException($validator->errors()->first());
        }

        DB::beginTransaction();

        try{
            $result = $this->testRepository->createTest($data);
        } catch (Exception $e){
            DB::rollBack();
            Log::info($e->getMessage());

            throw new InvalidArgumentException('Unable to create post data');
        }

        DB::commit();

        return $result;
    }

    /**
     * Get test by id.
     *
     * @param $id
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function show($id)
    {

        $result = $this->testRepository->getTestById($id);

        if (empty($id)) {
            return back();
        }

        return $result;
    }

    /**
     * Update post data
     * Store to DB if there are no errors.
     *
     * @param $id
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function update($id,$data)
    {
        $validator = Validator::make($data, [
            'title' => 'bail|min:2',
            'content' => 'bail|max:255',
            'is_completed' => 'min:1',
        ]);

        if ($validator->fails()) {
            throw new InvalidArgumentException($validator->errors()->first());
        }

        DB::beginTransaction();

        try {
            $result = $this->testRepository->updateTestById($id, $data);
        } catch (Exception $e) {
            DB::rollBack();
            Log::info($e->getMessage());
            throw new InvalidArgumentException('Unable to update post data');
        }

        DB::commit();
        return $result;
    }

    /**
     * Delete post by id.
     *
     * @param $id
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $result = $this->testRepository->deleteTestById($id);
        } catch (Exception $e) {
            DB::rollBack();
            Log::info($e->getMessage());
            throw new InvalidArgumentException('Unable to delete post data');
        }
        DB::commit();
        return $result;
    }
}
```

## Controller
```php
# app\Http\Controllers\TestController.php
<?php

namespace App\Http\Controllers;

use App\Service\TestService;
use Exception;
use Illuminate\Http\Request;

class TestController extends Controller
{
    protected $testService;
    public function __construct(TestService $testService)
    {
        $this->testService = $testService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $result = '';

        try {
            $result = $this->testService->index();
        } catch (Exception $e) {
            $result = $e->getMessage();
        }

        return $result;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $result = '';

        $data = $request->only([
            'title',
            'content',
            'is_completed'
        ]);

        try {
            $result = $this->testService->store($data);
        } catch (Exception $e) {
            $result = $e->getMessage();
        }

        return $result;
    }

    /**
     * Display the specified resource.
     *
     * @param  id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $result = '';

        try {
            $result = $this->testService->show($id);
        } catch (Exception $e) {
            $result = $e->getMessage();
        }

        return $result;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  Test $test
     * @return \Illuminate\Http\Response
     */
    public function edit(Test $test)
    {
        //
    }

    /**
     * Update test.
     *
     * @param Request $request
     * @param id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $result = '';

        $data = $request->only([
            'title',
            'content',
            'is_completed'
        ]);
        try {
            $result = $this->testService->update($id,$data);
        } catch (Exception $e) {
            $result = $e->getMessage();
        }

        return $result;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $result = '';

        try {
            $result = $this->testService->destroy($id);
        } catch (Exception $e) {
            $result = $e->getMessage();
        }

        return $result;
    }
}

```

## Interface와 Repository 바인딩

Service Container에 바인딩을하기 위한 Provider 생성
```bash
php artisan make:provider RepositoryServiceProvider
```

```php
# app\Providers\RepositoryServiceProvider.php
<?php

namespace App\Providers;

use App\Repository\Interface\TestRepositoryInterface;
use App\Repository\TestRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(TestRepositoryInterface::class, TestRepository::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
```

Provider 등록
```php
# config/app.php
'providers' => [
  ...
  /*
  * RepositoryServiceProvider
  */
  App\Providers\RepositoryServiceProvider::class,
]
```

## Postman으로 API 테스팅
라라벨에서 PUT,PATCH 메소드는 POST메소드로 사용해야되고 _method에 PUT 또는 PATCH값을 담아서 보내야됩니다.

![content_laravel_service_repository_postman.png](/study/assets/content_laravel_service_repository_postman.png)