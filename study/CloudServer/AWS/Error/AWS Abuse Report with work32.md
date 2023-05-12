# AWS Abuse Report with work32

## 원인
<details>
  
  <summary>AWS로 전달 받은 메일</summary>

  ```markdown
  Hello,

  We have not received a response regarding the abuse report implicating resources on your account. Failure to respond could lead to possible mitigation against the implicated resources.

  In order to resolve this report please reply to this email within 24 hours with the corrective action taken to cease the activity.

  Required Actions: investigate root cause

  Reported Activity: Port Scanning
  Abuse Time: 27 Apr 2023 14:46:47 GMT

  If you require further assistance with resolving this abuse report/complaint please see: https://aws.amazon.com/premiumsupport/knowledge-center/aws-abuse-report/

  If you do not consider the activity abusive, please reply to this email detailing the reasons why.

  Regards,
  AWS Trust & Safety

  ---Beginning of forwarded report(s)---

  Hello,

  This is a notification of unauthorized uses of systems or networks.

  We have observed IP addresses from your network probing my servers for TCP open ports. Due to their dubious behavior, they are suspected to be compromised botnet computers.

  The log of TCP port scans is included below for your reference (time zone is UTC). To prevent this mail from getting too big in size, at most 5 attempts from each attacker IP are included. Those connection attempts have all passed TCP's 3-way handshake, so you can trust the source IP addresses to be correct.

  If you regularly collect IP traffic information of your network, you will see the IPs listed connected to various TCP ports of my server at the time logged, and I suspect that they also connected to TCP ports of many other IPs.

  If a Linux system was at the attacker's IP, you might want to use the command "netstat -ntp" to list its active network connections. If there is still some suspicious connection, find out what PID/program/user ID they belong to as you might find something to help you solve this problem.

  In addition to the above, kindly notify the victims (owners of those botnet computers) as this will assist them in taking the appropriate action to clean their computers. Once this action is completed, not only will it prevent severe incidents such as data leakage and DDos but, it will also stand off botnets from taking up your network bandwidth.

  ---- log of TCP port scans (time zone is UTC) ----
  -------------------------------------------------------------------------------

  (attacker's IP) (IP being scanned) (TCP port being scanned)
  >>>

  ```
  
</details>
AWS에서 보내온 메일을 요약하자면 다음과 같습니다.

인스턴스에서 `Port Scanning`공격을 하고 있고, 그에 대한 조치를 해야됩니다.

저는 메일을 늦게 확인했고, 그에 따른 AWS의 조치는 다음과 같았습니다.

SSH의 Port 22의 원격 호스트로의 아웃바운드 TCP 트래픽 차단
```markdown
We have not received a response regarding the abuse report implicating resources on your account. To mitigate the abuse, we have taken the following steps:

Blocked OUTBOUND TCP traffic from instance to remote hosts on port 22
```

## 1차 조치
그에 따른 조치는 다음과 같이 진행 했습니다.

1. 의심스러운 PID 제거
    ![](/study/assets/content_cloudserver_aws_abuse_work32.png)
    > SYN Port Scanning 공격이 이뤄 지고 있는것을 확인 할 수 있습니다.

2. 전달 받은 메일 중 log of TCP port scans와 같이 Port Scanning 로그 파일을 보내줍니다. 그에 따라서 공격이 들어온 포트를 다른번호의 포트로 변경했습니다.
3. 서버에서 확인된 악성 파일 제거 및 Crontab 스케줄러에 등록된 악성 스케줄러 제거했습니다.

    ![](/study/assets/content_cloudserver_aws_abuse_work32_crontab.png)


## 1차 조치 후 답변
<details>
  
  <summary>1차 답변</summary>

  ```
  In reviewing your Amazon EC2 instances, it appears you have left several ports open to the public (0.0.0.0/0). Leaving ports open like this can leave your instance vulnerable to compromise and unwanted network activity in general.

  ALL         0.0.0.0/0

  To prevent further abuse from your resource(s), AWS Trust & Safety has the following recommendations:

  1. Back up your data, migrate your applications to a new instance, and terminate the old one. If you are restoring from a snapshot, use one that was taken well before the compromise occurred.

  2. Restrict inbound access to your instance using Security Groups, especially on administrative ports like TCP 22 and 3389. Using your EC2 security groups, you can limit access to a specific IP address or range via the following guide:
  https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html

  3. Review the below resources for additional tips on securing your EC2 instances and environment:
  * Windows on Amazon EC2 Security Guide: https://aws.amazon.com/answers/security/aws-securing-windows-instances
  * Tips for Securing Your EC2 Instance: https://aws.amazon.com/answers/security/aws-securing-ec2-instances
  * AWS Security Best Practices: https://d1.awsstatic.com/whitepapers/Security/AWS_Security_Best_Practices.pdf

  4. Use CloudWatch alarms to be notified about irregular network or CPU activity on your instance:
  * https://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/US_AlarmAtThresholdEC2.html

  5. Follow our AWS Security Blog to learn how to implement new and existing security features:
  * https://blogs.aws.amazon.com/security/
  ```
</details>

## 2차 조치
1. 인스턴스 스냅샷 생성
2. EC2 직렬 콘솔로 접속 후 필요한 테이터 백업
3. 문제가 생긴 인스턴스 중지 후 제거
4. 새로운 인스턴스 생성