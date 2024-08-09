# 显示特定id留言

显示特定id留言

**URL** : `/api/posts/:id`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Condition** : 用户可以看到当前id的帖子

**Code** : `200 OK`

**Content** : 

```json
{
      "id": "帖子id，格式为uuid",
      "title": "帖子标题",
      "content": "帖子内容",
      "status": "in progress", // 帖子状态，分为"in progress"（进行中）和"done"（已完成）
      "likes": 23, // 关注数
      "views": 123, // 浏览数
      "poster": { // 发帖者资料
        "username": "human", 
      },
      "createdAt": "2024-07-30T04:31:55.614Z", 
      "updatedAt": "2024-07-30T04:31:55.614Z", 
      "comments": [  // 评论列表
        {
          "id": "评论的id", 
          "content": "评论的内容", 
          "likes": 7,
          "commenter": {
            "username": "another human" // 评论者的资料
          }
        }
      ]
    }
```
## Error Responses

**Condition** : 找不到对应`id`的留言

**Code** : `404 NOT FOUND`

**Content** : `{}`

## Note

he `/api/articles/` endpoint supports the following query parameters:

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| comments      | boolean |若为`true`，返回所有该留言下的评论，否则不返回评论 |
