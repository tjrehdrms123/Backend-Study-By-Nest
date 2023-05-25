# MVC with Service, Repository 패턴 적용

[Laravel-Service-Repository-Patten.git](https://github.com/tjrehdrms123/Laravel-Service-Repository-Patten)

## 용어 정리

### Model
 - DB 트랜잭션을 실행하기 전 모델 컨벤션(테이블 이름, 접근 컬럼, 키)등 을 정의합니다.


### View
 - 사용자 화면을 보여줍니다.

### Controller
 - 사용자로부터 전달 받은 데이터를 `Service`에 넘겨줍니다.
 - `View`가 있는 경우 `View`를 반환 합니다.

### Service
 - 서비스에서는 데이터의 유효성을 검사합니다.
 - 오류가 있다면 예외를 반환 합니다.
 - 오류가 없다면 `Repository`를 호출합니다.

### Repository
 - CRUD(생성, 읽기, 업데이트 및 삭제)를 수행합니다.
 - `Model`에서 정의된 컨벤션을 기준으로 사용합니다.

## Migrations
`tests` 테이블을 생성 및 컬럼을 생성합니다.
```php
# create_tests_table.php
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

## Model
컨벤션을 정의합니다.
```php
# app\Models\test.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

## View
```php
# resources/vies/test.blade.php
<!doctype html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>테스트</title>
</head>
<body>
테스트
</body>
</html>
```

## Controller

TestService를 주입 받아 사용합니다.

의존성 주입에 대해 잘 모르시면 해당 링크를 참고해주세요.
 - [Nestjs로 이해하는 IoC와 DI](https://github.com/tjrehdrms123/TIL/blob/main/study/Pattern/IoC/Nestjs%EB%A1%9C%20%EC%9D%B4%ED%95%B4%ED%95%98%EB%8A%94%20IoC%EC%99%80%20DI.md)

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

## Service
```php
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