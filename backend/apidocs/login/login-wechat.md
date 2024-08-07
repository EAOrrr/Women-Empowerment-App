# 用户通过微信登录

为已注册用户分配一个令牌`token`
> 注：使用该方法登录，若用户不存在，则返回代码 `401 Unauthorized`，前端可以在 `/api/login/wechat`进行注册

**URL** : `/api/login/wechat`

**Method** : `POST`

**Auth required** : NO

**Data constraints** : 
```json
{
  "code": "[wx.login返回的code值]"
}
```

**Data example**: 
```json
{
  "code": "wxloginreturn123456"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "token": "93144b288eb1fdccbe46d6fc0f241a51766ecd3d"
}
```

## Error Response

**Condition** : If 'username' and 'password' combination is wrong.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "error": [
        "user does not exist."
    ]
}
```