# 用户通过密码登录

为已注册用户分配一个访问令牌`token`和一个刷新令牌`refrestToken`

**URL** : `/api/login/pwd`

**Method** : `POST`

**Auth required** : NO

**Data constraints** : 
```json
{
  "username": "用户名",
  "password": "密码"
}
```

**Data example**: 
```json
{
    "username": "iloveauth",
    "password": "abcd1234"
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

**Condition** : 密码和用户名的组合错误

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "non_field_errors": [
        "invalid username or password."
    ]
}
```