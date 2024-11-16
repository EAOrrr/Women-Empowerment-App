# 批量删除图片

批量删除图片。

**注意**，此端口将`token`放于内容中，不符合规范，因仅用于仅支持从请求体获取认证信息如beacon方式的发送

**URL** : `/images/deletebatch`

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : 仅管理员

**Data constraints** : 
Beacon 默认设置 Content-Type 为 text/plain，但内容本身是 JSON 格式的字符串
```json
{
  imageIds: ["id1", "id"],
  token:"Bearer token"
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


