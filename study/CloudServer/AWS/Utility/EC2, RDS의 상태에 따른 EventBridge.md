# EC2, RDS의 상태에 따른 EventBridge
Lambda와 Webhook을 연결하는 방법을 모르시면 해당 링크를 참고해서 먼저 읽으시길 바랍니다.

[참고 URL](./%5BJANDI%5D%20AWS%20Lambda%EB%A5%BC%20%EC%82%AC%EC%9A%A9%ED%95%B4%20CloudWatch%EC%9D%98%20%EA%B2%BD%EB%B3%B4%EB%A5%BC%20Webhook%EC%9C%BC%EB%A1%9C%20%EC%97%B0%EA%B2%B0%ED%95%98%EA%B8%B0.md)

## EC2 상태 변경 체크
EC2가 아래의 상태로 변경시 Lambda 동작 후 Slack으로 전송
```
pending
shutting-down
stopping
stopped
terminated"
```
## RDS 이벤트 체크
RDS가 아래의 이벤트가 발생시 Lambda 동작 후 Slack으로 전송

[참고 URL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.Messages.html)
```
DB cluster created.
Cluster failover failed, check the health of your cluster instances and try again.
...
```

## EventBridge 코드
### EC2
규칙 이름 : ec2_status_event
```json
{
  "source": ["aws.ec2"],
  "detail-type": ["EC2 Instance State-change Notification"],
  "detail": {
    "state": ["pending", "shutting-down", "stopping", "stopped", "terminated"]
  }
}
```

### RDS
규칙 이름 : rds_status_event
```json
{
  "source": ["aws.rds"],
  "detail-type": ["RDS DB Instance Event"]
}
```

### Lambda 코드
```js
exports.handler = async (event, context) => {
  console.log(event);
  const axios = require('axios');
  const slackPayload = event.source === 'aws.ec2' ? {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Alarm Name:*\n${event['detail-type']}`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*인스턴스 ID :*\n${event.detail['instance-id']}`
          },
          {
            type: 'mrkdwn',
            text: `*상태 :*\n${event.detail.state}`
          }
        ]
      }
    ]
  } : {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Alarm Name:*\n${event['detail-type']}`
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*인스턴스 ID :*\n${event.detail.SourceIdentifier}`
          },
          {
            type: 'mrkdwn',
            text: `*상태 :*\n${event.detail.Message}`
          }
        ]
      }
    ]
  };

  try {
    await axios.post("슬랙 웹훅 URL", slackPayload);
    console.log('Slack notification sent successfully');
    return {
      statusCode: 200,
      body: 'Slack notification sent successfully'
    };
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    return {
      statusCode: 500,
      body: 'Failed to send Slack notification'
    };
  }
};

```

## Log
람다에서 받을 수 있는 값을 확인하는 방법은 아래와 같이 콘솔에 찍은 후 이벤트를 발생 시켜 넘어 오는 값을 CloudWatch Logs에서 확인 할 수 있다.
```js
consosle.log(event)
```

![](/study/assets/content_aws_eventbridge_log.png)

## Sample Image
![](/study/assets/content_aws_eventbridge_sample01.png)
![](/study/assets/content_aws_eventbridge_sample02.png)