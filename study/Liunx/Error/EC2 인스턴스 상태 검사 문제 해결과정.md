# EC2 인스턴스 상태 검사 문제 해결과정

기존에 돌아가고 있는 인스턴스를 AMI를 떠 복제해 개발용 인스턴스를 만들려고 했었습니다.

복제한 후 상태 검사 중 `연결성 검사`에 계속 실패해 원인을 분석하는 도중 `Root로 Python 버전을 변경하면 Redhat 계열의 서버들은 Yum이 꼬여버리는 문제가 발생한다.`라는 글을 보았고 해당 이슈로 파악 했습니다.

## 분석


AWS의 EC2는 `최초 생성시` cloud-init을 통해 AWS와 통신하는 절차를 진행합니다.

그런데 이때 urllib3을 사용하는데 `python version이` 변경되며 urllib3이 호환되지 않거나 package 위치가 변경되며 `누락이 발생하면 등록되지 않습니다.`

### AMI를 뜨기전 서버는 재부팅을 해도 상태 검사에 문제가 없는 이유는 다음과 같습니다.

생성 당시 초기에 정상적으로 되었기 때문에 정상이였던 것 입니다.

## 방안

계정내에서 따로 Python 설치하여 쓰거나 Vitual env를 최대한 활용해야되고, 아니면 절대경로로 잡아서 따로 실행하거나...Root의 환경 변수를 꼬이게 하면 안됩니다.

## 발생했던 에러 로그
```python
Traceback (most recent call last):
  File "/usr/bin/landscape-sysinfo", line 11, in <module>
    from twisted.internet import reactor
  File "/usr/lib/python3/dist-packages/twisted/internet/reactor.py", line 38, in <module>
    from twisted.internet import default
  File "/usr/lib/python3/dist-packages/twisted/internet/default.py", line 56, in <module>
    install = _getInstallFunction(platform)
  File "/usr/lib/python3/dist-packages/twisted/internet/default.py", line 44, in _getInstallFunction
    from twisted.internet.epollreactor import install
  File "/usr/lib/python3/dist-packages/twisted/internet/epollreactor.py", line 24, in <module>
    from twisted.internet import posixbase
  File "/usr/lib/python3/dist-packages/twisted/internet/posixbase.py", line 18, in <module>
    from twisted.internet import error, udp, tcp
  File "/usr/lib/python3/dist-packages/twisted/internet/tcp.py", line 31, in <module>
    from twisted.internet._newtls import (
  File "/usr/lib/python3/dist-packages/twisted/internet/_newtls.py", line 21, in <module>
    from twisted.protocols.tls import TLSMemoryBIOFactory, TLSMemoryBIOProtocol
  File "/usr/lib/python3/dist-packages/twisted/protocols/tls.py", line 41, in <module>
    from OpenSSL.SSL import Error, ZeroReturnError, WantReadError
  File "/usr/lib/python3/dist-packages/OpenSSL/__init__.py", line 8, in <module>
    from OpenSSL import crypto, SSL
  File "/usr/lib/python3/dist-packages/OpenSSL/crypto.py", line 1553, in <module>
    class X509StoreFlags(object):
  File "/usr/lib/python3/dist-packages/OpenSSL/crypto.py", line 1573, in X509StoreFlags
    CB_ISSUER_CHECK = _lib.X509_V_FLAG_CB_ISSUER_CHECK
AttributeError: module 'lib' has no attribute 'X509_V_FLAG_CB_ISSUER_CHECK'
Error in sys.excepthook:
Traceback (most recent call last):
  File "/usr/lib/python3/dist-packages/apport_python_hook.py", line 72, in apport_excepthook
    from apport.fileutils import likely_packaged, get_recent_crashes
  File "/usr/lib/python3/dist-packages/apport/__init__.py", line 5, in <module>
    from apport.report import Report
  File "/usr/lib/python3/dist-packages/apport/report.py", line 32, in <module>
    import apport.fileutils
  File "/usr/lib/python3/dist-packages/apport/fileutils.py", line 12, in <module>
    import os, glob, subprocess, os.path, time, pwd, sys, requests_unixsocket
  File "/usr/lib/python3/dist-packages/requests_unixsocket/__init__.py", line 1, in <module>
    import requests
  File "/usr/lib/python3/dist-packages/requests/__init__.py", line 95, in <module>
    from urllib3.contrib import pyopenssl
  File "/usr/lib/python3/dist-packages/urllib3/contrib/pyopenssl.py", line 46, in <module>
    import OpenSSL.SSL
  File "/usr/lib/python3/dist-packages/OpenSSL/__init__.py", line 8, in <module>
    from OpenSSL import crypto, SSL
  File "/usr/lib/python3/dist-packages/OpenSSL/crypto.py", line 1553, in <module>
    class X509StoreFlags(object):
  File "/usr/lib/python3/dist-packages/OpenSSL/crypto.py", line 1573, in X509StoreFlags
    CB_ISSUER_CHECK = _lib.X509_V_FLAG_CB_ISSUER_CHECK
AttributeError: module 'lib' has no attribute 'X509_V_FLAG_CB_ISSUER_CHECK'
```
