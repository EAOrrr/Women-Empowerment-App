# 管理员发布全局消息

发布全局消息

**URL** : `/api/notifications/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : 仅管理员可用

**Data constraints** : 
`message` 都不可为空
```json
{
  "message": "全局message信息"
}
```

## Success Responses

**Code** : `201 Created`

**Content** : 

```json
{
  "id": "消息id",
  "message": "消息内容",
  "content": "帖子内容",
  "type": "global",
  "jumpTo": null,
  "read": false,
  "createdAt": "2024-07-30T04:31:55.614Z", 
  "updatedAt": "2024-07-30T04:31:55.614Z",
}
```