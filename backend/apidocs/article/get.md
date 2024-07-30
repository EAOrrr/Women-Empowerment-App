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