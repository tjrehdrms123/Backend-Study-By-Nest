# [ 코드 리뷰 ] MVC패턴 Controller에서 Controller호출을 해야될까?

## 상황 설명

메인 페이지를 구성하기 위해 배너 게시판 데이터, 프로그램 게시판 데이터, 광고 게시판 데이터 등 여러개의 데이터가 필요한 상태입니다.

그 과정에서 MVC패턴에 맞게 어떻게 데이터를 보낼지 고민했습니다.

## 코드 설명

해당 코드는 Index 컨트롤러이고 Banner 컨트롤러, Programe 컨트롤러를 호출해 필요한 데이터를 가져오고 있습니다.

Index 컨트롤러에서 Banner, Programe컨트롤러를 호출하도록 작성한 이유는 Banner, Programe컨트롤러에서 데이터를 가공한다고 했을때 가공한 데이터를 Index 컨트롤러에서는 사용하기만해 [단일 책임 원칙](/study/Paradigm/OOP/SOLID/Single%20responsibility%20principle.md)을 지킬 수 있고, 추 후 테스트를 진행 했을때 옳바른 설계라고 생각 했습니다.

```php
protected $BannerController;
protected $ProgrameController;
public function __construct(BannerController $BannerController, ProgrameController $ProgrameController)
{
    //의존성 주입
    $this->BannerController  = $BannerController;
    $this->ProgrameController= $ProgrameController;
}
public function index()
{
    try{
        //메인페이지에서 필요한 배너 데이터 추출
        [$bannerItem,$advertItem]      = $this->BannerController->index();
        //메인페이지에서 필요한 프로그램 데이터 추출
        [$programeItem,$recommendItem] = $this->ProgrameController->index();
        return view('main.index')
            ->with([
                'bannerItem'=>$bannerItem,
                'advertItem'=>$advertItem,
                'programeItem'=>$programeItem,
                'recommendItem'=>$recommendItem
            ]);
    } catch (\Exception $e){
        ddd($e->getMessage());
    }
}
```
