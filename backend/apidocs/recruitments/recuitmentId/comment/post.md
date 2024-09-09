# 在特定id招聘启事下发布评论

在特定id留言下发布评论

**URL** : `/api/recruitments/:id/comments`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : NO

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
  "userId": "123456",
  "commentableType": "article",
  "commentableId": "61c95099-031e-4f60-adcf-08deea328620",
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