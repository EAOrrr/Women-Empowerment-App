# 用户通过微信登录

为已注册用户分配一个令牌`token`
> 注：使用方法登录，若用户不存在，则自动注册
> 有待解决：若用户不存在，弹出页面让用户输入信息？？

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

**Code** : `400 Unauthorized`

**Content** :

```json
{
    "error": [
        "invalid username or password."
    ]
}
```