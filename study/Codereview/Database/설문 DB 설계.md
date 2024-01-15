![](/study/assets/thumbnail_codereview.jpg)

# [ 코드 리뷰 ] 설문 DB 설계

![20230320_183636.png](/study/assets/content_codereview_survey.png)

해당 설문지는 구글 강의 설문지 입니다.

구글 설문지를 커스텀하게 구현하려고했을때 막혔던 DB 테이블 설계에 대해 공유해보려고합니다.

## 처음 설계 했을때

![content_codereview_survey02](/study/assets/content_codereview_survey02.png)

문항을 하나의 컬럼에 배열 형태로 넣어, 코드단에서 데이터를 파싱해서 보여주려고 했습니다.

하지만 위와 같이 개발할 경우 데이터를 파싱할때와 저장할때 에러가 생길 가능성이 높고, `제 1정규화`를 위배하게 됩니다.

## 피드백 후 2번째 설계

![content_codereview_survey03](/study/assets/content_codereview_survey03.png)

5개의 문항 컬럼을 미리 만들서 사용하려고 했습니다.

하지만 위와 같이 개발할 경우 `확장성`이 떨어집니다.

문항이 5개 이상으로 많아 지거나 문항에 대한 옵션 (ex: 문항 별 점수)이 다를 경우 대응 할 수 없습니다.

## 최종 설계 변경

![content_codereview_survey05](/study/assets/content_codereview_survey05.png)

![content_codereview_survey04](/study/assets/content_codereview_survey04.png)

문제 테이블과 문항 테이블을 분리하여, 문항 테이블에 `question_id` 컬럼을 만들어 FK로 연결 했습니다.

문항에 추가 옵션이 생길 수 있을 것 같다라는 고민을 했었는데, 문항에 `정럴, 점수 컬럼 기능이 추가`되어 빠르게 개발 할 수 있었습니다.
