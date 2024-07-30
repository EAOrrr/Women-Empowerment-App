# 删除特定id的文章

删除特定id文章

**URL** : `/api/articles/:id`

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : 仅允许管理员对文章进行管理

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

**Condition** : If Account does not exist with `id` of provided `id` parameter.

**Code** : `404 NOT FOUND`

**Content** : `{}`
