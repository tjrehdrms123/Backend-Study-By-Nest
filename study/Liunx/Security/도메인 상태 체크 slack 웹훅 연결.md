# 도메인 상태 체크 Slack 웹훅 연결

CURL 요청을 보내 200, 201이 아니라면, slack web hook 주소로 noti를 보냅니다.

- send_slack_message: 200 또는 201이 아닌 경우에만 동작하는 함수
- site_http_code: 특정 사이트로 요청을 보내 HTTP Code를 담고 있는 변수

```bash
#!/bin/bash
send_slack_message() {
  url="$1"
  message="$2"
  http_code="$3"
  
  if [[ "$http_code" != "200" && "$http_code" != "201" ]]; then
    curl -X POST --data-urlencode "payload=$message" "$url"
  fi
}

# 각 웹사이트에 대한 HTTP 요청을 보내고 상태 코드를 가져옵니다.
site_http_code=$(curl -s -o /dev/null -w "%{http_code}" https://naver.com/)

# 각 웹사이트에 대한 Slack 메시지를 보냅니다.
send_slack_message "Slack Webhook URL" "{\"channel\": \"#aws-notice\", \"username\": \"webhookbot\", \"text\": \"[TEST]https://naver.com : [HTTP Code]$site_http_code\", \"icon_emoji\": \"::smile_cat\"}" $site_http_code
```