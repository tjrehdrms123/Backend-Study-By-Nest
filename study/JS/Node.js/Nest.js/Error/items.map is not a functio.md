![](/study/assets/thumbnail_nestjs.png)

# adminjs에서 Add new item을 클릭 시 items.map is not a function에러

![](/study/assets/content_nestjs_admin_add_new_item_map_error.png)
adminjs에서 위와 같이 Add New item을 만들어 동적으로 값을 생성하러고 했다 해당 Item에는 Type이 Types.ObjectId 형식으로 들어가길 원했다 처음에 작성한 코드는 아래와 같다 아래와 같이 작성했을때 제목글 처럼 오류가 발생했다 adminjs TypeError: items.map is not a function

```js
# project.schema.ts
@Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: "User"
  })
  team: Types.ObjectId;

# project.resource.ts
team: { type: 'reference', isArray: true },
```

오류를 보고 정의 되어있는 Type을 보았다. 객체 타입이 아니여서 adminjs 코어에서 map함수를 사용할 수 없겠다 라는 생각이 들었다. 그래서 아래와 같이 변경 하고 에러를 잡았다

```js
# project.schema.ts
@Prop({
    type: [MongooseSchema.Types.ObjectId],
    ref: "User"
  })
  team: Types.ObjectId;
```
