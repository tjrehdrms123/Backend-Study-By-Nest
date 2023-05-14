# [ 코드 리뷰 ] MVC패턴 Controller에서 Controller호출을 해야될까?

## 상황 예시

![](/study/assets/content_codereview_mvc.png)
예시 메인 페이지를 구성하기 위해서는 총 4개의 데이터가 필요합니다.컨트롤러에서 메인페이지를 보여줄때 4개의 데이터를 어떻게 가져올 수 있을까요?

## 상황 설명

메인 페이지를 구성하기 위해 게시글 데이터, 메뉴 데이터 등 여러개의 데이터가 필요한 상태입니다.

그 과정에서 MVC패턴에 맞게 어떻게 데이터를 보낼지 고민했습니다.

## 코드 설명

해당 코드는 Index 컨트롤러이고 Menu 컨트롤러, Programe 컨트롤러를 호출해 필요한 데이터를 가져오고 View로 넘길때 필요한 데이터를 같이 넘기고 있습니다.

Index 컨트롤러에서 Menu, Post컨트롤러를 호출하도록 작성한 이유는 Menu, Post컨트롤러에서 데이터를 가공한다고 했을때 가공한 데이터를 Index 컨트롤러에서는 사용하기만해 [단일 책임 원칙](/study/Paradigm/OOP/SOLID/Single%20responsibility%20principle.md)을 지킬 수 있고, 추 후 테스트를 진행 했을때 옳바른 설계라고 생각 했습니다.

```php
protected $MenuController;
protected $PostController;
public function __construct(MenuController $MenuController, PostController $PostController)
{
    //의존성 주입
    $this->MenuController  = $MenuController;
    $this->PostController= $PostController;
}
public function index()
{
    try{
        //메인페이지에서 필요한 배너 데이터 추출
        [$MenuItem]      = $this->MenuController->index();
        //메인페이지에서 필요한 프로그램 데이터 추출
        [$PostItem] = $this->PostController->index();
        return view('main.index')
            ->with([
                'MenuItem'=>$MenuItem,
                'PostItem'=>$PostItem
            ]);
    } catch (\Exception $e){
        ddd($e->getMessage());
    }
}
```

## 리뷰 후 코드 리팩토링

Controller에서 Controller를 호출하는 코드가 이상하다고 느낀 저는 옳바른 방법인지 코드 리뷰후 아래의 조언을 들었습니다.

1. 전통 MVC 방식에서는 컨트롤러에서는 모델을 호출하는게 맞다.

   - 컨트롤러를 주입하지 말고 모델을 주입해 사용

   ```php
    // 리팩토링 후 코드
    //메인페이지에서 필요한 배너 데이터 추출
    $MenuItem = $this->MenuModel->index();
    //메인페이지에서 필요한 프로그램 데이터 추출
    $PostItem = $this->PostModel->index();
   ```

2. 가공할 데이터가 있을때 처리는 A,B모델을 상속 받은 더 큰 모델을 만들어서 가공하면된다 라는 조언을 들었습니다. 해당 조언처럼 고수준의 인터페이스를 제공하는 디자인 패턴을 [Facade Patten](/study/Pattern/Facade/Facade%20Patten.md)이라고 합니다.
