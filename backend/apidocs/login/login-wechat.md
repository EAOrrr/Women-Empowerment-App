# 用户通过微信登录

为已注册用户分配一个访问令牌`token`和一个刷新令牌`refrestToken`
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
    "token": "93144b288eb1fdccbe46d6fc0f241a51766ecd3d",
    "refreshToken": "刷新令牌",
    "username": "用户名",
    "avater": "用户头像"
}
```

## Error Response

**Condition** : 不能根据微信 `openid` 找到对应的已注册的用户

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "error": "user does not exist."
}
```

### Or

**Condition**：在根据用户提供的`code`调用微信官方API找对应的 `openid`时出错

**Code**: `502 BAD GATEWAY`

**Content**: 
```json
{
  "error": "something went wrong when trying to get openid"
}

