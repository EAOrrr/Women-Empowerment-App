# 删除特定id留言

删除特定id留言，当留言被删除时，也其对应的评论也自动被删除

**URL** : `/api/posts/:id`

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : 
1. 管理者
2. 发帖者

**Data constraints** : `{}`

## Success Responses

**Code** : `204 No Content`

**Content** : `{}`


## Error Responses

**Condition** : 用户权限不足

**Code** : `403 Forbidden`

**Content** : 
```json
{
  "error": "The data is modified without permission"
}
```
