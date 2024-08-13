# 上传图片
上传图片

**URL** : `/api/upload/images/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : 仅管理员可用

**Data constraints** : 
`message` 都不可为空
```json
{
  "message": "全局message信息"
}
```

## Success Responses

**Code** : `201 Created`

**Content** : 

```json
{
  "message": "Image uploaded successfully",
  "imageId": "图片id",
  "imageUrl": "图片链接",
  "createdAt": "2024-07-30T04:31:55.614Z", 
  "updatedAt": "2024-07-30T04:31:55.614Z",
}
```