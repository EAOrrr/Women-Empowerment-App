# Show Current User

获取当前已验证用户的详细信息以及基本订阅信息。

**URL** : `/api/user/me`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content examples**

For a User with ID 1234 on the local database where that User has saved an
email address and name information.

```json
{
    "id": 1234,
    "phone": 4321,
    "avatar": "xx.img",
    "username": "auser",
    "notificationCount": 3 // 消息数
}
```

For a user with ID 4321 on the local database but no details have been set yet.

```json
{
    "id": 4321,
    "phone": null,
    "avatar": null,
    "username": "又一个用户"
}
```