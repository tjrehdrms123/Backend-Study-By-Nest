# Laravel Firebase를 통한 앱 푸시

## 작업 프로세스
- [디바이스 토큰 저장 프로세스](/study/ETC/Process/Firebase%20%EC%95%B1%20%ED%91%B8%EC%8B%9C.md)

## [ APP ] 앱 실행 / Firebase에서 DeviceToken값을 전달 받음

## 1. 로그인 성공시 / 2. 유저의 ID를 포함한 임시 페이지 전달
```php
public function login(Request $request)
{
    try {
        ...etc
        // 성공시 임시 페이지로 이동
        return redirect()->route('apppush.index', ['action' => 'device_token', 'id' => auth()->user()->id]);
    } catch (Exception $e) {
        Log::error($e->getMessage());
    }
}
```

## 3. [ APP ] Device Token API 호출
## 4. 전달 받은 유저의 ID에 DeviceToken값 저장 / 인덱스 페이지 이동
```php
public function deviceStore(Request $request)
{
    $requestData = json_decode($request->getContent(), true);
    $id = $requestData['id'];
    $token = $requestData['token'];
    try {
        $user = User::where('id', $id)->first();
        $user->token = $token;
        $user->save();
        redirect()->route('index');
        return response()->json([
            'success' => true
        ]);
    } catch (Exception $e) {
        Log::error($e);
        return response()->json([
            'success' => false,
            'message' => '오류가 발생했습니다.'
        ]);
    }
}
```

## 5. 앱 푸쉬
```php
public function sendPushNotification($token, $option)
    {
        // Push 시작
        $ch = curl_init("https://fcm.googleapis.com/fcm/send");
        $header = array("Content-Type:application/json", "Authorization:key=<FirebaseKey>");
        $data = json_encode(array(
            "to" => $token,
            "notification" => array(
                "title"   => '제목',
                "body" => '내용',
                "image" => "logo.png"
            )
        ));

        Log::error([
            "info" => "sendPushNotification",
            "to" => $token,
            "noti" => [
                '제목',
                '내용'
            ]
        ]);

        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_exec($ch);
        curl_close($ch);
    }
```