# 删除编辑中的文本草稿

删除编辑中的文档草稿

**URL** : `/api/upload/draft`

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
