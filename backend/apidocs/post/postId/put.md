# 修改特定id留言

修改特定id留言

**URL** : `/api/posts/:id`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : 
1. 对于浏览数`views`和关注数`likes`，任何登录的用户都可以修改
2. 对于帖子的状态`status`,只有可以发帖者可以修改
3. 对于标题`title`和内容`content`以及日期类字条，任何用户不可修改
4. 评论`comment`的修改请查看[发表评论]()和[修改评论]()

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
  "id": "帖子id",
  "title": "帖子标题",
  "content": "帖子内容",
  "status": "in progress", 
  "likes": 234, 
  "views": 1224, 
  "poster": {
    "userId": "123456",
    "username": "human",
  },
  "createdAt": "2024-07-30T09:45:25.614Z", 
  "updatedAt": "2024-07-30T04:31:55.614Z",
  "comments": []
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
