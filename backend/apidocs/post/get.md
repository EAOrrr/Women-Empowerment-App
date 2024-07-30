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
[  // 帖子列表
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
      "numberOfComments":3 
    }
]
```

## Notes 
### Query

The `/api/articles/` endpoint supports the following query parameters:

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| type      | string |按类型筛选留言。可能的值: `activity`, `policy`, `law` |
|keyWord     | string | 根据关键词在筛选标题或内容含该关键词的留言                   |
| limit     | number | 限制返回的文章数量       |
| offset    | number | 偏移返回文章的起始点 |
|ordering   | string | 根据给定的功能排序留言，可能的值:`createdTime`, `likes`, `views`, "updatedTime"
