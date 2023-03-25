![](/study/assets/thumbnail_nestjs.png)

# Nestjs With Adminjs Mongoose Error given id: "types"

Nestjs에서 mongoose를 사용중 아래와 같은 에러가 발생되었다
원인은 ref의 사용법 문제였다

```markup
This is the list of all registered resources you can use:
Project, Team, Type, User, Cat
Error: There are no resources with given id: "types"
This is the list of all registered resources you can use:
Project, Team, Type, User, Cat
```

처음의 코드는 아래와 같은 형식으로 작성하였다 기존 nestjs에서는 아래의 코드가 동작 되었었는데 adminjs에서는 위와 같은 에러가 발생되었다

```js
@Prop({
  type: Types.ObjectId,
  required: true,
  ref: "cats",
})
@IsNotEmpty()
author: Types.ObjectId;
```

위의 코드를 아래와 같이 수정하였다
변경된 부분은 ref가 컬렉션(테이블)이름이 아닌 에러코드에서 사용할 수 있다고 명시된 리소스 명으로 사용하였다. 또한 type이 MongooseSchema.Types.ObjectId으로 변경되었다

```js
@Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "Cat"
  })
  planer: Types.ObjectId;
```
