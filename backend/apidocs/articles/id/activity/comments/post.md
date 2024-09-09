# 在特定id的活动文章下发布评论与评分

在特定id的活动文章下发布评论与评分

**URL** : `/api/articles/:id/activity/comment`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : NO

**Data constraints** : 
```json
{
  "content": "评论内容",
  "score": 4 // 评分，范围在 1-5
}
```

## Success Responses

**Code** : `201 Created`

**Content** : 

```json
{
  "id": "评论id",
  "content": "评论内容",
  "likes": 23,
  "userId": "用户ID",
  "commentableType": "article",
  "commentableId": "文章ID",
  "createdAt": "2024-07-30T04:31:55.614Z", 
  "updatedAt": "2024-07-30T04:31:55.614Z",
}
```

## Error Responses

**Condition** : 发送格式错误

**Code** : `400 BAD REQUEST`

**Content** : 
```json
{
  "error": "Only activity can be ranked and commented"
}
```

```json
{
  "error": "Content is required"
}
```

```json
{
  "error": "Score must be between 1 and 5"
}
```


### Or

**Condition** : 找不到对应`id`的文章

**Code** : `404 NOT FOUND`

**Content** : `{}`