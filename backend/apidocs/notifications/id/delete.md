# 删除特定id消息

删除特定id消息

**URL** : `/api/notifications/:id`

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : 拥有消息的用户

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
  "error": "You are not allowed to delete this notification"
}
```
### Or

**Condition** :  找不到对应`id`的写欧系·

**Code** : `404 NOT FOUND`

**Content** : `{}`