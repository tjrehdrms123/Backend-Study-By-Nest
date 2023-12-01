# Naver, Kakao 로그인 및 추가정보 받기

### 비회원 Workflow
1. 홈페이지 접속합니다. 미들웨어에서 최초 접근한 페이지를 `Laravel 세션`에 저장 합니다. (미들웨어 통해 처리: SnsAuthenticate)
2. 유저가 아니라면 로그인/회원가입 페이지로 이동합니다. (미들웨어 통해 처리: SnsAuthenticate)
3. 회원가입 클릭시 `provider(naver/kakao)`에 맞는 `redirect` 메서드 호출 후 `callback`으로 리다이렉트 시킵니다. (SocialController)
4. callback에서 `새로운 유저라면` 유저 테이블에 유저를 생성하고 추가 정보 페이지로 이동 시키고, `추가정보가 없는 유저라면` 바로 추가 정보 페이지로 이동 시킵니다. (SocialController)
5. 추가 정보를 입력하면 추가정보를 저장하고 최초 접근 페이지 `Laravel 세션`에 담아둔 값으로 이동 시킵니다.

## 실행 환경
```
PHP 8.0.13
Laravel Framework 8.83.2
Composer version 2.1.14
```

## 1. Socialite & Provider 패키지 설치

```bash
composer require laravel/socialite
composer require socialiteproviders/kakao
composer require socialiteproviders/naver
```

## 2. Kakao, Naver 환경 변수 설정 및 등록

### config/services.php

```php
'kakao' => [
    'client_id' => env('KAKAO_CLIENT_ID'),
    'client_secret' => env('KAKAO_CLIENT_SECRET'),
    'redirect' => env('KAKAO_URL')
],

'naver' => [
    'client_id' => env('NAVER_CLIENT_ID'),
    'client_secret' => env('NAVER_CLIENT_SECRET'),
    'redirect' => env('NAVER_URL')
]
```

### .env

```bash
# Naver API
NAVER_CLIENT_ID=""
NAVER_CLIENT_SECRET=""
NAVER_URL="임의로 지정 | {URL}/login/naver/callback"
# Kakao API
KAKAO_CLIENT_ID="APP KEY(REST API 키)"
KAKAO_CLIENT_SECRET="APP KEY(REST API 키)"
KAKAO_URL="임의로 지정 | {URL}/login/kakao/callback"
```

## 3. 프로바이더 등록

### app/Providers/EventServiceProvider.php

```php
protected $listen = [
    Registered::class => [
        SendEmailVerificationNotification::class,
    ],
    SocialiteWasCalled::class => [
        KakaoExtendSocialite::class,
        NaverExtendSocialite::class,
    ]
];
```

### config/app.php

```php
    'providers' => [
        /*
         * Application Service Providers...
         */
        
        // 소셜 로그인
        Laravel\Socialite\SocialiteServiceProvider::class,
        \SocialiteProviders\Manager\ServiceProvider::class,
    ],
```

## 3. Route 정의

### routes/web.php

```php
// 소셜 로그인 Route
Route::prefix('/login/{provider}')->group(function () {
    Route::get('/', [SocialController::class, 'redirect'])->name('login.sns');
    Route::get('/callback', [SocialController::class, 'callback']);
});
// 추가 정보 Route
Route::prefix('user/info')->group(function (){
    Route::post('/edit', [SocialController::class,'edit'])->name('user.info.edit');
    Route::get('/{id}', [SocialController::class,'index'])->name('user.info');
});
```

## 4. Controller 개발

### app/Http/Controllers/SocialController.php

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialController extends Controller
{
    // View: 소셜 로그인으로 받지 못한 추가 정보를 보여주는 페이지
    public function index(Request $request)
    {
        try{
            $user = $this->indexQuery($request->id);
            return view('auth.detail')->with('user', $user);
        } catch (\Exception $e) {
            ddd($e);
        }
    }
    private function indexQuery($id)
    {
        $user = User::where(['id'=> $id])->first();
        return $user;
    }
    // 추가 정보 업데이트 후 최조 접속 페이지로 이동
    public function edit(Request $request)
    {
        try{
            $this->editQuery($request);
            return redirect($request->session()->get('back')); 
        } catch (\Exception $e) {
            ddd($e);
            return redirect($request->session()->get('back'));
        }
    }
    // 추가 정보 업데이트 실행
    public function editQuery($request)
    {
        try{
            $user = User::where(['id'=> $request->id])->first();
            $address = $request->region[0] == 'on' ? '서울' : $request->region[0];
            $user->sex = $request->sex;
            $user->address = $address;
            $user->job = $request->job;
            $user->phone = $request->phone;
            $user->age = $request->age;
            $user->save();
            return true;
        } catch (\Exception $e) {
            ddd($e->getMessage());
        }
    }
    // $provider 드라이버 호출
    public function redirect($provider)
    {
        return Socialite::driver($provider)->redirect();
    }
    // 소셜 로그인 실행
    public function callback(Request $request,$provider)
    {
        try{
            $userSocial = Socialite::driver($provider)->user(); // 유저 정보 있음
            $users = User::where(['email'=> $userSocial->getEmail(), 'provider'=> $provider])->first(); // 유저가 이미 있는지 확인
            if($users){
                // 회원가입 했지만 추가 정보가 없을때 || 회원일 경우
                if(is_null($users->sex) || is_null($users->address) || is_null($users->job) || is_null($users->phone)){
                    return redirect()->route('user.info',[$users->id]); // 추가정보 페이지로 넘김
                }
                Auth::login($users);
                return redirect($request->session()->get('back')); // 최초 접속 페이지로 이동 시킴
            } else {
                // 회원가입 하지 않았을때
                $this->callbackQuery($userSocial,$provider); // 유저 생성
                $users = User::where(['email' => $userSocial->getEmail(), 'provider' => $provider])->first();
                Auth::login($users);
                return redirect()->route('user.info',[$users->id]);
            }
        } catch(\Exception $e){
            return redirect()->route('index.sns'); // 로그인 페이지
        }
    }

    private function callbackQuery($userSocial,$provider){
        try{
            // 유저 회원가입
            User::create([
                'name'     => $userSocial->getName(),
                'email'    => $userSocial->getEmail(),
                'id'       => $userSocial->getid(),
                'provider' => $provider,
                'password' => md5($userSocial->getId())
            ]);
            return true;
        } catch (\Exception $e) {
            // 예외 처리 코드
            ddd($e->getMessage());
        }
    }
}
```

## 5. Middleware 개발 및 적용

### app\Http\Middleware\SnsAuthenticate

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class SnsAuthenticate
{
    public function handle($request, Closure $next)
    {

        // 현재 URL 가져오기
        $currentUrl = url()->current();

        $request->session()->put('back', $currentUrl); // 최초 접근한 페이지 Laravel 세션에 담음 
        // 사용자가 인증되어 있지 않은 경우 sns.index로 리디렉션
        if (!Auth::user()) {
            return redirect()->route('index.sns'); // 로그인 페이지
        }


        // 사용자의 주소, 성별, 전화번호 중 하나라도 null인 경우 user.info로 리디렉션
        if (is_null(Auth::user()->address) || is_null(Auth::user()->sex) || is_null(Auth::user()->phone)) {
            return redirect()->route('user.info', ['id' => Auth::user()->id]); //추가 정보 페이지
        }

        // 위의 조건이 모두 만족하지 않으면 다음 미들웨어로 이동
        return $next($request);
    }
}
```

### routes/web.php

```php
// sns 로그인 및 추가정보가 없다면 접근하지 못하도록 미들웨어 적용
Route::middleware('sns.auth')->group(function() {
    // ... 기타 Route
});
```