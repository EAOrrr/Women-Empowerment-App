# 修改特定id文章

修改特定id留言

**URL** : `/api/articles/:id`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : 
1. 对于浏览数`views`和关注数`likes`，任何登录的用户都可以修改
2. 对于标题`title`、内容`content`、文章分类`type`字条，只有管理员可修改
3. 其他栏目不可修改

**Data constraints** : 
```json
{
  "field1": "new data1",
  "field2": "new data2"
}
```

**Data example** : 
```json
{
  "likes": 234,
  "views": 1224
}
```

## Success Responses

**Code** : `200 OK`

**Content** : 
修改后的帖子

```json
{
  "id": "文章id，格式为uuid",
  "title": "文章标题",
  "content": "文章内容",
  "author" : "文章作者", 
  "type": "activity", 
  "likes": 234,
  "views": 1224,
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

**Condition** : 找不到对应id的文章

**Code** : `404 NOT FOUND`

**Content** : `{}`