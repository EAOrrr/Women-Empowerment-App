# 修改特定postId下的特定commentId评论

修改特定postId下的特定commentId评论

**URL** : `/api/posts/:postid/comments/:commentId`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : 
1. 任何登录用户可以修改likes
2. 任何不可以修改其他区域

**Data constraints** : 
```json
{
  "likes": 23
}
```



## Success Responses

**Code** : `200 OK`

**Content** : 
修改后的帖子

```json
{
  "id": "评论id",
  "content": "评论内容",
  "likes": 23,
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
  "error": "The data is modified without permission"
}
```
