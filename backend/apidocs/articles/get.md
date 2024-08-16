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
{
  "articles":
  [ // 文章列表
      {
        "id": "文章id，格式为uuid",
        "title": "文章标题",
        "abstract": "文章摘要",
        "author" : "文章作者", // 可能为null
        "cover": "文章封面图片", // 可能为空，建议前端设置默认图片应对null情况，字符串格式，为封面对应的链接
        "type": "activity", // 文章类型，分为"activity"（活动）、"policy"（政策）"law"（法律）
        "likes": 23, // 关注数
        "views": 123, // 浏览数
        "tags": ["标签1：", "标签2"],
        "createdAt": "2024-07-30T04:31:55.614Z", 
        "updatedAt": "2024-07-30T04:31:55.614Z", 
      }
  ],
  "cursor": "下次获取开始的光标"
}

```

## Notes 
### Query

The `/api/articles/` endpoint supports the following query parameters:

| Parameter | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| type      | string |按类型筛选文章。可能的值: `activity`, `policy`, `law` |
|keyword     | string | 根据关键词在筛选标题或内容含该关键词的文章                   |
| limit     | number | 限制返回的文章数量, 默认为10       |
|ordering   | string | 根据给定的功能排序文章，可能的值:`created-at`, `likes`, `views`，默认为`created-at`
| tags       | string | 根据给定的标签返回含有对应标签的文章，多个标签用逗号分隔 |
| cursor    | string | 用于分页的游标，base64编码的字符串，在上次请求中返回 |
| offset  | number| 用于分页的偏移量，从 `offset+1`篇文章后返回，默认为0 |
| total | boolean | 如果`total`为真，则返回查询文章的总数`count`，否则`count`为`undefined`


Example usage:

```
/api/articles/?type=activity&limit=10&tags=tag1,tag2,tag3&cursor=YWJjZCxlZmdoLGhlbGxvIHdvcmxk
```

上述查询会返回从`cursor`之后的前10篇类型为`activity`并且标签同时含有`tag1`, `tag2`, `tag3`的文章

```
/api/articles/?type=activity&limit=10&tags=tag1,tag2,tag3&offset=23
```

上述查询会返回检索结果的第24篇开始的10篇（即24篇到33篇共10篇）类型为`activity`并且标签同时含有`tag1`, `tag2`, `tag3`的文章

> 注意，如果要重新搜索显示，请不要附上`cursor`查询

> 注意： `offset`和`cursor`不能同时使用，建议顺序浏览用`cursor`，如下滑浏览等，分页浏览用`offset`


