# Update Current User

允许已验证用户更新自己的信息

**URL** : `/api/user/`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : None

**Data constraints**
用户权限不可以更改。密码，手机号头像等可以更改

```json
{
    "phone": "[11个数字]",
    "avatar": "[image]",
    "username": "[3到30个字符，必须唯一]"
}
```


## Success Responses

**Condition** : Data provided is valid and User is Authenticated.

**Code** : `200 OK`

**Content example** : Response will reflect back the updated information. A
User with `id` of '1234' sets their name, passing `UAPP` header of 'ios1_2':

```json
{
    "id": 1234,
    "phone": 2233,
    "username": "joe"
}
```

## Error Response

**Condition** : 提供的数据非法，比如密码`password`过短，用户名`username`非法.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "error": "[对应的错误信息]"
}
```

### Or

**Condition**: 用户对应的id不存在

**Code**: `404 NOT FOUND`