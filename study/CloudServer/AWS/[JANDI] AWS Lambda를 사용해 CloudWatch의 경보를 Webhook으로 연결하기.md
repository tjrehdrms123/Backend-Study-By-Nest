![](/study/assets/thumbnail_aws.jpg)

### [JANDI] AWS Lambda를 사용해 CloudWatch의 경보를 Webhook으로 연결하기

### 작업하기전 기능 설계

1. CloudWatch에 원하는 특정 경보 등록한다( 어떤 트리거가 발생했을때 JANDI의 Webhook을 동작하게 할 것인지 )
2. 위에서 생성한 경보를 Lambda에 등록한다
3. JANDI Webhook규격에 맞게 Lambda에 코드 작성한다

### 사용되는 기술은 아래와 같습니다

- AWS Lambda(SDK Node.js)
- AWS CloudWatch
- JANDI Webhook

### 1\. CloudWatch에 원하는 특정 경보 하기

![image.png](/study/assets/content_aws_jandi_webhook01.png)

> CloudWatch를 검색 후 경보 생성을 클릭한다.

![image.png](/study/assets/content_aws_jandi_webhook02.png)

> 원하는 지표를 선택합니다. 다음 스텝에서 지표에 대한 조건을 설정할 수 있습니다.

![image.png](/study/assets/content_aws_jandi_webhook03.png)

> 위 예제에서는 CPU 사용률이 40보다 클떄로 조건을 설정했습니다.

### 2\. 경보를 Lambda에 등록

![image.png](/study/assets/content_aws_jandi_webhook04.png)

> 트리거 추가 버튼을 클릭 후 등록했던 CloudWatch 경보를 추가합니다. 추가하게되면 트리거 메뉴에서 상세한 정보를 볼수 있습니다. 자세히 보셔야될 부분은 `CloudWatch Alarm State Change` CloudWatch 알림 상태가 변경되면 트리거가 동작되는 상세 타입 부분입니다.

### JANDI에서 제공하는 Webhook 양식

```js

/*
  HTTP Headers 설정
	Accept: application/vnd.tosslab.jandi-v2+json
	Content-Type: application/json
*/

// POST request의 포맷
{
	"body" : "[[PizzaHouse]](http://url_to_text) You have a new Pizza order.",
	"connectColor" : "#FAC11B",
	"connectInfo" : [{
	"title" : "Topping",
	"description" : "Pepperoni"
},
	{
		"title": "Location",
		"description": "Empire State Building, 5th Ave, New York",
		"imageUrl": "http://url_to_text"
	}]
}
```

### 규격에 맞게 Lambda코드 작성

> 아래처럼 트리거가 동작했을때 axios로 요청을 보내주도록 작성했습니다.

```js
exports.handler = async (event, context) => {
  const axios = require("axios");
  await axios({
    method: "post",
    url: "https://wh.jandi.com/connect-api/webhook/(채팅방 마다 다름)",
    headers: {
      Accept: "application/vnd.tosslab.jandi-v2+json",
      "Content-Type": "application/json",
    },
    body: {
      body: event.detail.alarmName,
      connectInfo: [
        {
          title: event.detail.state.reason,
          description: event.detail.state.reasonData,
        },
      ],
    },
  });
};
```

### 실제 동작 확인

![image.png](/study/assets/content_aws_jandi_webhook05.png)

### 참고사항

Lambda에서 event객체에 JANDI Webhook으로 보낼 수 있는 여러가지 값이 있습니다. 사용 용도에 맞게 사용하시면 됩니다.
