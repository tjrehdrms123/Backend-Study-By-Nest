# Facade Patten이란?

파서드 패턴은 저수준의 인터페이스를 하나의 고수준의 인터페이스로 묶어주는 패턴입니다.

파서드 패턴을 이용하면 고수준의 인터페이스의 메서드 호출 한 번만으로 저수준의 필요한 값을 가져올 수 있습니다.

> 파서드 패턴에서는 고수준 인터페이스를 저수준 인터페이스를 통합했다고 해서 `통합 인터페이스`라고 부릅니다.

## 파서드 패턴을 사용하지 않을때의 문제점

메인 페이지를 구성하기 위해서는 총 4개의 데이터가 필요합니다.
![](/study/assets/content_codereview_mvc.png)

파서드 패턴을 구현하지 않았을때의 코드는 필요한 데이터를 각 각 불러서 Index페이지는 4개의 모델에 의존성을 가지게 됩니다.

고수준의 객체에서 많은 저수준의 객체의 의존성을 갖게 되기 때문에 의존성이 강해집니다.

```php
public function index()
{
    try{
        [$HomeItem] = $this->HomeModel->index();
        [$ContactItem] = $this->ContactModel->index();
        [$MenuItem] = $this->MenuModel->index();
        [$PostItem] = $this->PostModel->index();
        return view('main.index')
            ->with([
                'HomeItem'=>$HomeItem,
                'ContactItem'=>$ContactItem,
                'MenuItem'=>$MenuItem,
                'PostItem'=>$PostItem
            ]);
    } catch (\Exception $e){
        ddd($e->getMessage());
    }
}
```

## 파서드 패턴을 사용하지 않을때의 문제 해결

저수준의 객체를 감싼 고수준의 객체를 만들어 한단계 더 추상화 시키고 시스템의 내부 동작을 이해하지 않아도 쉽게 사용할 수 있도록 할 수 있습니다.

Index페이지에서 필요한 4개의 데이터를 IndexModel 객체로 몰아 넣습니다.

```php
class IndexModel{
    public function index()
    {
        [$HomeItem] = $this->HomeModel->index();
        [$ContactItem] = $this->ContactModel->index();
        [$MenuItem] = $this->MenuModel->index();
        [$PostItem] = $this->PostModel->index();
        return [$HomeItem,$ContactItem,$MenuItem,$PostItem];
    }
}
```

IndexModel은 Index페이지를 만들기 위한 데이터를 보내는 고수준의 객체가 됩니다.

```php
public function index()
{
    try{
        [$HomeItem,$ContactItem,$MenuItem,$PostItem] = $this->IndexModel->index();
        return view('main.index')
            ->with([
                'HomeItem'=>$HomeItem,
                'ContactItem'=>$ContactItem,
                'MenuItem'=>$MenuItem,
                'PostItem'=>$PostItem
            ]);
    } catch (\Exception $e){
        ddd($e->getMessage());
    }
}
```

## 파서드 패턴의 문제점

1.인터페이스가 제공하는 기능만 사용 가능합니다. 복잡한 기능이 필요한 경우에는

2.인터페이스를 수정하거나 새로운 인터페이스를 만들어야 합니다.

3.시스템 내부의 변경 사항이 많은 경우에는 파사드 클래스가 지나치게 복잡해질 수 있습니다.

4.파사드 클래스가 많은 기능을 제공하다 보면, 단일 책임 원칙(Single Responsibility Principle)을 위반할 수 있습니다.

5.파사드 클래스를 잘못 설계하면, 객체 간의 결합도가 높아져 유연성이 떨어질 수 있습니다.
