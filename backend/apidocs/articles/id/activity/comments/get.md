# 显示特定id活动文章的所有评论

显示特定id活动文章的所有评论

**URL** : `/api/articles/:id/activity/comments`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Condition** : 用户可以看到当前id的帖子的所有评论

**Code** : `200 OK`

**Content** : 
```json
[  // 评论列表
  {
    "id": "评论id",
    "content": "评论内容",
    "likes": 23,
    "userId": "用户ID",
    "commentableType": "article",
    "commentableId": "文章ID",
    "createdAt": "2024-07-30T04:31:55.614Z", 
    "updatedAt": "2024-07-30T04:31:55.614Z",
}
]
```

## Error Response 

**Condition** : 对应id文章不是活动（`activity`）类型文章

**Code** : `400 BAD REQUEST`

**Content** : 
```json
{
  "error": "Only activity can be commented."
}
```