# 显示所有文章

显示所有文章

**URL** : `/api/articles/`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Condition** : User can see one or more aritcles.

**Code** : `200 OK`

**Content** : 

```json
[ // 文章列表
    {
      "id": "文章id，格式为uuid",
      "title": "文章标题",
      "abstract": "文章摘要",
      "author" : "文章作者", // 可能为null
      "type": "activity", // 文章类型，分为"activity"（活动）、"policy"（政策）"law"（法律）
      "likes": 23, // 关注数
      "views": 123, // 浏览数
      "createdAt": "2024-07-30T04:31:55.614Z", 
      "updatedAt": "2024-07-30T04:31:55.614Z", 
      "tags": ["生育", "工作"]
    }
]
```

## Notes 
### Query

The `/api/articles/` endpoint supports the following query parameters:

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| type      | string |按类型筛选文章。可能的值: `activity`, `policy`, `law` |
|keyWord     | string | 根据关键词在筛选标题或内容含该关键词的文章                   |
| tags      | array  | 根据标签筛选文章        |
| limit     | number | 限制返回的文章数量       |
| offset    | number | 偏移返回文章的起始点 |
|ordering   | string | 根据给定的功能排序文章，可能的值:`createdTime`, `likes`, `views`

Example usage:

```
/api/articles/?type=activity&tags=work&limit=10&offset=0
```

This query will retrieve the first 10 articles of type "activity" written by "John Doe" and tagged with "work".


