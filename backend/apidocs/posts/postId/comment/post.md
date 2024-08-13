# 在特定id留言下发布评论

在特定id留言下发布评论

**URL** : `/api/posts/:id/comments`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : 
1. 管理员
2. 发帖者

**Data constraints** : 
```json
{
  "content": "评论内容"
}
```

## Success Responses

**Code** : `201 Created`

**Content** : 

```json
{
  "id": "评论id",
  "content": "评论内容",
  "likes": 0, // 初始化为0
  "commenter": {
    "userId": "123456",
    "username": "human",
  },
  "createdAt": "2024-07-30T04:31:55.614Z", 
  "updatedAt": "2024-07-30T04:31:55.614Z",
}
```

## Error Responses

**Condition** : 用户权限不足

**Code** : `403 Forbidden`

**Content** : 
```json
{
  "error": "You do not have permission to perform this action."
}
```

### Or

**Condition** : 找不到对应`id`的留言

**Code** : `404 NOT FOUND`

**Content** : `{}`