# 发布新留言

发布新留言

**URL** : `/api/posts/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : None

**Data constraints** : 
```json
{
  "title": "帖子标题",
  "content": "帖子内容"
}
```

## Success Responses

**Code** : `201 Created`

**Content** : 

```json
{
  "id": "帖子id",
  "title": "帖子标题",
  "content": "帖子内容",
  "status": "in progress", // 初始化为进行中
  "likes": 0, // 初始化为0
  "views": 0,  // 初始化为0
  "poster": {
    "userId": "123456",
    "username": "human",
  },
  "createdAt": "2024-07-30T04:31:55.614Z", 
  "updatedAt": "2024-07-30T04:31:55.614Z",
  "comments": [] // 评论初始化为空列表
}
```