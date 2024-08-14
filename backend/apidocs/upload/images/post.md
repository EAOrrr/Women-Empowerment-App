# 上传图片
上传图片

**URL** : `/api/upload/images/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : 仅管理员可用

**Data constraints** : 
- **Format**: 必须是 JPEG, PNG 或 GIF 格式
- **Size**: 文件大小不得超过 5MB

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