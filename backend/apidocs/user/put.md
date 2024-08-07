# Update Current User

允许已验证用户更新自己的信息

**URL** : `/api/user/:id`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : None

**Data constraints**

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

**Condition** : If provided data is invalid, e.g. a name field is too long.

**Code** : `400 BAD REQUEST`

**Content example** :

```json
{
    "first_name": [
        "Please provide maximum 30 character or empty string",
    ]
}
```

### Or

**Condition**: 用户对应的id不存在

**Code**: `404 NOT FOUND`