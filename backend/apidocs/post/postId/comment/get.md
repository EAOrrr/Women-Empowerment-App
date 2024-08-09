# 显示特定id留言的所有评论

显示特定id留言的所有评论

**URL** : `/api/posts/:id`/comments

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
    "id": "评论的id", 
    "content": "评论的内容", 
    "likes": 7,
    "commenter": {
      "username": "another human" // 评论者的资料
    }
  }
]
```
