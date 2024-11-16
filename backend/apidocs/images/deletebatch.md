# 批量删除图片

批量删除图片
**URL** : `/images/deletebatch`

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : 仅管理员

**Data constraints** : 
```json
{
  imageIds: ["id1", "id"]
}
```

## Success Responses

**Code** : `204 No Content`

**Content** : `{}`


## Error Responses

**Condition** : 用户权限不足或未登录

**Code** : `401 unauthorized`

**Content** : 
```json
{
  "error": "The data is modified without permission"
}
```


