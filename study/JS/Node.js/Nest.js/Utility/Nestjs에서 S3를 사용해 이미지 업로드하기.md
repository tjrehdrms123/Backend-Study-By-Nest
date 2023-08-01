![](/study/assets/thumbnail_nestjs.png)
# Nestjs에서 S3를 사용해 이미지 업로드하기 with React toast-ui

### 1. 필요한 패키지 설치

```sh
npm install aws-sdk
```

### 2. 개발에 들어가기전 로직 및 기능 설계

> 프론트 React에서 사용하는 에디터(toast-ui)에서 이미지를 업로드하면 백엔드 Nestjs에서 S3에 이미지 업로드 후 URL 반환합니다 이미지 수정은 기존이미지를 지우고 덥어 씌우는 방식으로 진행예정입니다.

### 3. 필요한 코드 작성

> 파일 위치: aws.service.ts
> 설명: 파일을 업로드, 파일 삭제, 업로드한 파일 URL 반환하는 메소드가 있다

> AWS S3 SDK를 사용할 수 있도록 환경 변수에 선언해둔 `S3ACCESSKEY`, `S3SECERTKEY`, `S3REGION`, `S3BUCKET`을 사용해 awsS3를 세팅합니다

```js
import * as path from 'path';
import * as AWS from 'aws-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PromiseResult } from 'aws-sdk/lib/request';

// sharp

@Injectable()
export class AwsService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor() {
    this.awsS3 = new AWS.S3({
      accessKeyId: process.env.S3ACCESSKEY, // process.env.AWS_S3_ACCESS_KEY
      secretAccessKey: process.env.S3SECERTKEY,
      region: process.env.S3REGION,
    });
    this.S3_BUCKET_NAME = process.env.S3BUCKET; // nest-s3
  }

  async uploadFileToS3(
    folder: string,
    file: Express.Multer.File,
  ): Promise<{
    key: string;
    s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    contentType: string;
    url: string;
  }> {
    try {
      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');
      // 공백을 제거해주는 정규식

      const s3Object = await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();
        const imgUrl = `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
      return { key, s3Object, contentType: file.mimetype, url: imgUrl };
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  async deleteS3Object(
    key: string,
    callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void,
  ): Promise<{ success: true }> {
    try {
      await this.awsS3
        .deleteObject(
          {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
          },
          callback,
        )
        .promise();
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`Failed to delete file : ${error}`);
    }
  }

  public getAwsS3FileUrl(objectKey: string) {
    return `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;
  }
}
```

> 파일 위치: posts > controller > posts.controller.ts
> 파일 설명: 위에서 작성한 S3 업로드 메소드를 호출하는 컨트롤러 코드입니다
> 주의할 점 : 이미지 업로드 API를 호출할때 `multipart/form-data`타입으로 호출해줘야 하고 `FileInterceptor`에 선언한것 처럼 필드 명은 `image`로 호출되어야 합니다

```js
@ApiOperation({ summary: '에디터 이미지 업로드' })
@ApiResponse({
  status: 200,
  description: '성공!'
})
@ApiResponse({
  status: 400,
  description: '값은 형식이 옳바르지 않습니다 | 값이 비어있습니다',
})
@UseInterceptors(FileInterceptor('image'))
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Post('/editor/upload')
async uploadUserImg(
  @UploadedFile() file: Express.Multer.File,
) {
  return await this.awsService.uploadFileToS3('posts', file);
}
```

### API Testing
> Nest Test를 통해 문제 없이 동작되는 지 테스트를 진행해보겠습니다.
> 문제 없이 통과한 것을 확인 할 수 있습니다.
![image.png](/study/assets/content_nestjs_s3_test.png)
```js
describe('/posts/editor/upload : (POST) : 블로그 에디터 이미지 업로드', ()=>{
    it('블로그 에디터 이미지 업로드 성공 테스트', async () => {
      const response = await request(app.getHttpServer())
      .post(`/posts/editor/upload`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'multipart/form-data')
      .attach('image', './test/images/profile.jpg')

      expect(response.statusCode).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data.hasOwnProperty('key')).toBe(true)
      expect(response.body.data.hasOwnProperty('url')).toBe(true)
    });
  });
```

### Front에서 사용할때 코드입니다.
```js
# toast-ui Component Example
<Editor
  initialValue="내용을 입력해주세요"
  previewStyle="vertical"
  height="600px"
  initialEditType="wysiwyg"
  useCommandShortcut={false}
  plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
  ref={editorRef}
  onChange={onChangeContent}
  language="ko-KR"
  hooks={{
    addImageBlobHook: onUploadImage
  }}
/>

# Upload Hooks Example
const onUploadImage = async (blob, callback) => {
  try{
    const imageData = await uploadEditorImage({"image":blob});
    callback(imageData['data']['url'], '');
    return false;
  } catch(error){
    alert(error.message);
  }
};

# Upload API Call
export const uploadEditorImage = async (file) => {
const res = await axios.post(
  `${serverAddress}${postPath}/editor/upload`,
  file,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);
return res.data;
};
```