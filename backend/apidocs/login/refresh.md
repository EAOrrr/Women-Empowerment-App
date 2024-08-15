# 用户通过刷新令牌获取新的访问令牌和刷新令牌
当用户访问令牌`token`过期收到`401 UNAUTHORIZED`时，用户可以通过刷新令牌获取新的访问令牌和刷新令牌

**URL** : `/api/login/refresh`

**Method** : `POST`

**Auth required** : NO

**Data constraints** : 
```json
{
  "refreshToken": "刷新令牌"
}
```


## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "token": "访问令牌",
    "refreshToken": "刷新令牌",
}
```

## Error Response

**Condition** : 刷新令牌或刷新令牌错误

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
  "error": "[对应的错误信息：token invalid 或 user not found]"
}
```