# 创建新用户-密码

创建新用户-密码

**URL** : `/api/users/pwd`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : None

**Data constraints** : 
`username` 和 `password` 都不可为空
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

**Condition** : 密码格式不对

**Code** : `400 BAD REQUEST`

**Content** : 
```json
{
  "error": "[对应的错误信息]"
}
```