# 创建新用户-密码

创建新用户-密码

**URL** : `/api/users/pwd`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : None

**Data constraints** : 
`username` 和 `password` 都不可为空,其中`username`不可与其他用户重复
```json
{
  "username": "username",
  "password": "password"
}
```

## Success Responses

**Code** : `201 Created`

**Content** : 

```json
{
  "username": "username",
  "password": "password" 
}
```

## Error Responses

**Condition** : 密码`password`格式不对或者用户名`username`已存在

**Code** : `400 BAD REQUEST`

**Content** : 
```json
{
  "error": "[对应的错误信息]"
}
```