# 删除特定id消息

删除特定id消息

**URL** : `/api/posts/:id`

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : 提供`token`对应 当用户

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
### Or

**Condition** :  找不到对应`id`的留言·

**Code** : `404 NOT FOUND`

**Content** : `{}`
