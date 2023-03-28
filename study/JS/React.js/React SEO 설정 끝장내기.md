![](/study/assets/thumbnail_react.png)

# React SEO 설정 끝장내기
React는 SPA(Single Page Application)으로 `하나의 html파일`로 구성되어있습니다.
빌드된 결과물을 보면 `<body></body>`는 비어있고 js가 body를 바꾸기 때문에 검색엔진은 이 사이트를 비어있는 사이트로 인식합니다. 그렇기 때문에 SEO에 취약합니다. 아래의 작업을해 보완 할 예정입니다.

1. 동적 Mata태그 설정
2. react-snap, react-router-sitemap을 써야될까?

## 동적 Mata태그 설정
컴포넌트에서 `head`태그에 태그를 삽입 할 수 있도록 아래의 `react-helmet` 패키지를 설치 후 설정합니다.
API에서 받아온 데이터를 설정하고 싶다면 아래 예시 코드처럼 설정하면 Meta태그가 `동적`으로 변경됩니다.
```
npm install react-helmet
```

```js
import { Helmet } from "react-helmet";
<Helmet>
  <meta name="description" content={seo?.description} />
  <meta name="keyword" content={seo?.keyword} />
  <meta property="og:site_name" content={seo?.og?.sitename} />
  <meta property="og:type" content={seo?.og?.type} />
  <meta property="og:url" content={seo?.og?.url} />
  <meta property="og:title" content={seo?.og?.title} />
  <meta property="og:description" content={seo?.og?.description} />
  <title>{seo?.title}</title>
</Helmet>
```

## react-snap, react-router-sitemap
### react-snap
react-snap은 지정한 페이지의 렌더링이 끝나면 html만을 크롤링해 static 파일로 만들어주는 역할을 합니다. 하지만 동적으로 데이터를 바꾸는 블로그 게시물과 같은 페이지는 static파일로 만들어질때 하나의 파일로 만들어 지기 때문에 적합하지 않습니다.

### react-router-sitemap
react-router-sitemap은 route를 기준으로 sitemap.xml을 생성해주는 패키지입니다 하지만 위와 같이 블로그 게시물과 같은 페이지는 static파일로 만들어질때 하나의 파일로 만들어 지기 때문에 적합하지 않습니다.

## 생각한 방법
어차피 데이터는 Backend에 있기 때문에 Backend에서 siteamp.xml이나 rss.xml과 같은 색인 파일을 만들어주면 되겠다 라고 생각을 했습니다.
- [Backend에서 sitemap, rss 파일 생성](https://blog.donggeun.co.kr/view/63d63c81eb1c6b0f5f1152dd)