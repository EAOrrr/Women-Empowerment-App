# 删除特定id图片

删除特定id图片

**URL** : `/imageUrl`

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : 仅管理员

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

**Condition** :  找不到对应链接对应的图片·

**Code** : `404 NOT FOUND`

**Content** : `{}`

