# 显示特定id的文章

显示特定`id`的文章

**URL** : `/api/articles/:id`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Condition** : User can see one or more aritcles.

**Code** : `200 OK`

**Content** : 

```json
{
  "id": "文章id，格式为uuid",
  "title": "文章标题",
  "content": "文章内容",
  "author" : "文章作者", // 可能为null
  "cover": "文章封面图片", // 可能为空，格式为照片
  "type": "activity", // 文章类型，分为"activity"（活动）、"policy"（政策）"law"（法律）
  "tags": ["标签1：", "标签2"]，
  "likes": 23, // 关注数
  "views": 123, // 浏览数
  "createdAt": "2024-07-30T04:31:55.614Z", 
  "updatedAt": "2024-07-30T04:31:55.614Z", 
}
```

## Note
### Content的格式
`content`以文本`TEXT`格式储存，但后续`content`储存内容除了文本，可能会拓展为`HTML`，包含图片、超链接等内容。