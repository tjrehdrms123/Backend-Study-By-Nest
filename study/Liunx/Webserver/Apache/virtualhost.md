![](/study/assets/thumbnail_apache.png)
# Apache VirtualHost 설정

가상 호스트란?
호스트 도메인을 등록하여 사용하고 있지만 추가적으로 한 서버에 여러 도메인을 등록하여 사용한다는 의미입니다.

### DNS에서 VirtualHost를 위한 메인 도메인과 서브 도메인 설정
![](/study/assets/content_apache_virtualHost.png)
도메인과 서브 도메인을 서버에 연결 합니다.

### VirtualHost 예시 설정
 - ServerName: 연결될 메인 도메인입니다 1개의 도메인만 입력 가능합니다.
 - ServerAlias: 연결될 서브 도메인입니다. 공백으로 구분해 입력하면 여러개의 도메인을 입력할 수 있습니다.
 - DocumentRoot: 도메인으로 접속시 보여질 웹 루트 입니다.
 - Directory: 웹 루트에 대한 설정을 할 수 있습니다.
   - 보안에 관련된 설정이기 때문에 사용 용도에 맞게 변경해서 사용해야됩니다.
```
<VirtualHost *:80>
  ServerName donggeun.co.kr
  ServerAlias vir.donggeun.co.kr
  DocumentRoot /home/donggeun
  ErrorLog  "|/usr/bin/rotatelogs /log/donggeun/error.log.%Y%m%d 86400"
  CustomLog "|/usr/bin/rotatelogs /log/donggeun/access.log.%Y%m%d 86400" combined
</VirtualHost>
<Directory /home/donggeun>
   Options Indexes FollowSymLinks
   AllowOverride All
   Require all granted
</Directory>
```