# 发布新文章

发布新文章

**URL** : `/api/articles/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : 仅允许管理员发布相关文章

**Data constraints** : 
```json
{
  "title": "文章标题", // 必填
  "content": "文章内容", // 必填
  "author": "文章作者", // 活动类必填
  "type": "文章类型", // 必填,
  "abstract": "文章摘要", // 选填，默认为article前50字
  "tags": ["标签1：", "标签2"] // 选填
}
```

## Success Responses

**Code** : `201 Created`

**Content** : 

```json
{
  "id": "文章id，格式为uuid",
  "title": "文章标题",
  "content": "文章内容",
  "author" : "文章作者", 
  "type": "activity", 
  "tags": ["标签1：", "标签2"],
  "likes": 0, // 初始化为0
  "views": 0, // 初始化为0
  "createdAt": "2024-07-30T04:31:55.614Z", 
  "updatedAt": "2024-07-30T04:31:55.614Z", 
}
```

## Note
后续可能会出一个单独的API