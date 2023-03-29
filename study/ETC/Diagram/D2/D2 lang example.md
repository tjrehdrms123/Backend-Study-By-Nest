![](/study/assets/thumbnail_os.png)

# D2 lang
D2 는 텍스트를 다이어그램으로 변환하는 다이어그램 스크립팅 언어입니다.
Declarative Diagramming 의 약자입니다

## D2 Install
```sh
curl -fsSL https://d2lang.com/install.sh | sh -s -- --dry-run # 설치 명령어 확인(실체 설치 X)
curl -fsSL https://d2lang.com/install.sh | sh -s --
```

## Install VScode Extension
vscode extesion에서 d2를 검색하고 설치해줍니다. 그래야 문법 highlight를 할 수 있습니다.

## D2 lang example
```js
Person.shape: person

Person -> Box -> Bigbox

Bigbox{
  middleBox: {
    RouteBox -> A Component
    RouteBox -> B Component
    RouteBox -> C Component
  }
}

title: 제목입니다. {
  shape: text
  near: top-center
  style: {
    font-size: 55
    italic: true
  }
}

description: 설명 글 입니다. {
  shape: text
  near: bottom-center
  style: {
    font-size: 18
  }
}
```

## 결과
![](/study/assets/content_etc_diagram_d2.png)


### 참고 링크
- [참고](https://d2lang.com/tour/intro/)