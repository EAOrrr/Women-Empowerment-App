# 修改特定postId下的特定commentId评论

修改特定postId下的特定commentId评论

**URL** : `/api/posts/:postid/comments/:commentId`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : 
1. 任何登录用户可以修改likes
2. 任何用户不可以修改其他区域

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
### Or

**Condition** : 对应的`postId`不存在对应帖子或`commentId`不存在对应评论

**Code** : `404 NOT FOUND`

**Content** : `{}`

### Or

**Condition** : `commentId`对应的评论并不是`postId`对应的留言下的评论

**Code** : `400 BAD REQUEST`

**Content** : 
```json
{
  "error": "The comment does not belong to the specified post."
}
```