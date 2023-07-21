# Laravel 모바일 딥링크 작업

## 작업 프로세스
- [딥링크 작업 프로세스](/study/ETC/Process/%EB%94%A5%EB%A7%81%ED%81%AC.md)

## 1. 공유하기 버튼 클릭
```php
// 공유 버튼 예시
<button type="button" class="deep_link">
    <input type="hidden" value="{{ $board->id }}" id="share_id_value">
    <p>공유하기</p>
</button>
```

## 2. 공유 카운트 증가 / 3. 앱 Share 링크 전달
```js
// 공유 카운트 증사 API의 예시
$(document).ready(function () {
    const deepLinkBtn = document.querySelector('.deep_link');
    // 딥 링크 클릭시
    deepLinkBtn.addEventListener('click',function(){
        const userAgent = navigator.userAgent;
        const shareIdValue =  $('#share_id_value').val(); // 공유한 게시글의 ID
        const ENDPOINT = {{ route('deep_link') }}; // APP Share 링크

        // 2. 공유 카운트 증가 API
        $.ajax({
            url: "/board-lists/share",
            type: "POST",
            data: {
                id: shareIdValue,
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success: function (response) {
                // 3. 공유 카운트 증가시 APP Share 링크의 쿼리스트링에 공유 페이지의 URL을 담아서 전달
                location.href = `${ENDPOINT}?url=${window.location.href}`;
            },
            error: function (xhr, status, error) {
                console.error(error);
            }
        });
    });
});
```

## 4. [ APP ] 앱 Share 페이지 캐치

## 5. [ APP ] SNS등 원하는곳에 페이지 공유

## 1. 공유된 앱 Share 페이지 접속 후 Share 페이지에서 공유(딥링크) 버튼 클릭시
```php
// Share 페이지 예시
@extends('layouts.master')

@section('content')
@php
// 쿼리스트링 값에서 공유된 페이지 URL을 가져옴
$url = request()->query('url');
@endphp
<div id="wrapper">
  <div id="share">
      <p class="share_btn_text">실행</p>
  </div>
</div>
<script>
    // IOS 딥 링크
    const deepLinkBtn = document.querySelector('.share_btn');
    deepLinkBtn.addEventListener('click',function(){
        const userAgent = navigator.userAgent;
        const visitedAt = (new Date()).getTime(); // 방문 시간
        const appShemaLink = 'deeplinkshare://application' // 앱 스키마 주소 예시
        if (userAgent.match(/iPhone|iPad|iPod/)) {
            setTimeout(
                function() {
                    if ((new Date()).getTime() - visitedAt < 2000) {
                        location.href = "APP Store 링크";
                    }
            }, 1000);
            setTimeout(function() {
                location.href = `${{ appShemaLink }}?url=${{ $url }}`;
            }, 0);
        } else {
            setTimeout(
                function() {
                    if ((new Date()).getTime() - visitedAt < 2000) {
                        location.href = "PlayStore 링크";
                    }
            }, 1000);
            setTimeout(function() {
                location.href = `${{ appShemaLink }}?url=${{ $url }}`;
            }, 0);
        }

    });
    // Andriod
</script>
@endsection
</body>
</html>
```