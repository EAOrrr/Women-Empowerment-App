# 创建新用户-微信

创建新用户-微信（可附上密码`passowrd`、头像`avatar`等字段

**URL** : `/api/users/pwd`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : None

**Data constraints** : 
`username` 和 `code` 都不可为空，其中`username`不可与其他用户重复
```json
{
  "username": "[用户名]",
  "code": "[wx.login 返回的code]"
}
```

## Success Responses

**Code** : `201 Created`

**Content** : 

```json
{
  "username": "username",
  "id": "userid"
}
```

## Error Responses

**Condition** : 无法根据code得到对应用户的openid

**Code** : `502 Bad Gateway`

**Content** : 
```json
{
  "error": "fail to get the openid of the corresponding user based on given code"
}
```

### Or

**Condition** : 发送的数据缺失 `code` 或 `username` 字段，或者`username`与其他用户重复

**Code** : `400 Bad Request`

**Content** : 
```json
{
  "error": "[对应的错误信息]"
}
```