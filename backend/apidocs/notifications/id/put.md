# 修改特定id消息

修改特定id消息

**URL** : `/api/notfications/:id`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : 
只有消息对应的用户可以修改消息的已读状态`read`

**Data constraints** : 
```json
{
  "read": true
}
```


## Success Responses

**Code** : `200 OK`

**Content** : 
修改后的帖子

```json
{
  {
    "id": "信息id",
    "message": "消息内容",
    "read": false, // 已读？
    "jumpTo": "详细信息在Note中",
    "type": "post_created", // 目前支持三种消息类型：post_created, comment_reply, global
    "createdAt": "2024-08-12T07:37:03.771Z",
    "updatedAt": "2024-08-12T07:37:03.771Z",
  },
}
```

## Error Responses

**Condition** : 用户权限不足

**Code** : `403 Forbidden`

**Content** : 
```json
{
  "error": "The data is modified without permission"
}
```

### Or

**Condition** : 找不到对应`id`的消息

**Code** : `404 NOT FOUND`

**Content** : `{}`