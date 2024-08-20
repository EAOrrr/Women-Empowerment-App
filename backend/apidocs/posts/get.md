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
      "numberOfComments":"3" // 回复数，字符串形式返回
    }
]
```

## Notes 
### Query

The `/api/articles/` endpoint supports the following query parameters:

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
|keyWord     | string | 根据关键词在筛选标题或内容含该关键词的留言                   |
| limit     | number | 限制返回的文章数量       |
|status| string| 可选 `done` `in-progress`
|ordering   | string | 根据给定的功能排序留言，可能的值:`created-at`, `likes`, `views`, `updated-at`
| cursor    | string | 用于分页的游标，base64编码的字符串，在上次请求中返回 |
| offset  | number| 用于分页的偏移量，从 `offset+1`篇文章后返回，默认为0 |
| total | boolean | 如果`total`为真，则返回查询文章的总数`count`，否则`count`为`undefined`

query用法同article，详见[article GET API](../articles/get.md)

> 注意，如果要重新搜索显示，请不要附上`cursor`查询

> 注意： `offset`和`cursor`不能同时是哟个


