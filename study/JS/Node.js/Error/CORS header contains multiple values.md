![](/study/assets/thumbnail_node.png)

# CORS header contains multiple values

## 에러 코드

```
Access to XMLHttpRequest at 'https://mapapi.donggeun.co.kr/user/login' from origin 'https://map.donggeun.co.kr' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The 'Access-Control-Allow-Origin' header contains multiple values 'https://map.donggeun.co.kr, http://donggeun.co.kr', but only one is allowed.
```

## 원인파악

Nginx, Express 둘다 CORS 설정을하게되면 해당 에러가 발생한다.

둘중 한곳에서만 CORS 설정을 해줘야한다.
