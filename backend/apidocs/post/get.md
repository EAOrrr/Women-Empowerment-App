# 显示所有留言

显示所有留言

**URL** : `/api/posts/`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Condition** : User can see one or more posts.

**Code** : `200 OK`

**Content** : 

```json
[
    {
      "id": "帖子id，格式为uuid"
      "title": "帖子标题"
      "content": "帖子内容"
      "status": "in progress", // 帖子状态，分为"in progress"（进行中）和"done"（已完成）
      "likes": 23, // 关注数
      "views": 123, // 浏览数
      "poster": { // 发帖者资料
        "username": "human", 
      },
      "createdAt": "2024-07-30T04:31:55.614Z", 
      "updatedAt": "2024-07-30T04:31:55.614Z", 
      "numberOfComments":3 
    }
]
```

**content explianed"** 
```json
[
    {
      "title": "[标题-字符串]",
      "content": "[内容-文本]",
      "status": "[in progress（进行中） | done（用户已完成并关闭留言）]",
      "likes": "[关注数]",
      "views": "[浏览数]",
      "poster": {
        // 以此格式输出因为后面可能需要发帖者更多信息（如头像等）
        "username": "[发帖者用户名]"
      },
      "createdAt": "[发帖时间]",
      "updatedAt": "[帖子最后修改时间]",
      "comments": [
        {
          "content": "[内容]",
          "likes": "[关注数]",
          "commenter": {
            // 以此格式输出因为后面可能需要评论者更多信息（如头像等）
            "username": "[评论者用户名]"
          }
        }
      ]
    }
]
```