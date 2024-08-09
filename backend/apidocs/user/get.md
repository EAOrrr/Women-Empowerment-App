# 显示所有用户

显示所有用户

**URL** : `/api/users/`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : 仅管理员可调用

**Data constraints** : `{}`

## Success Responses

**Condition** : User can see one or more userss.

**Code** : `200 OK`

**Content** : 
```json
[ // 用户列表
  {
    "id": "用户" ,
    "phone": "用户电话号码",
    "avatar": "用户头像",
    "username": "用户名",
    "createdAt": "2024-08-09T03:41:59.464Z",
    "updatedAt": "2024-08-09T03:41:59.464Z"
  }
]
```

