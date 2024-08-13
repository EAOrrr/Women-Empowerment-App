# 删除特定id招聘启事

删除特定id的招聘启事

**URL** : `/api/s/:id`

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
### Or

**Condition** :  找不到对应`id`的留言·

**Code** : `404 NOT FOUND`

**Content** : `{}`
