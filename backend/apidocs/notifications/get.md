# 获取当前已验证用户的消息信息
获取当前已验证用户的消息信息。

**URL** : `/api/notifications`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content examples**



```json
  [{
    "id": "信息id",
    "message": "消息内容",
    "read": false, // 已读？
    "jumpTo": "详细信息在Note中",
    "type": "post_created", // 目前支持三种消息类型：post_created, comment_reply, global
    "createdAt": "2024-08-12T07:37:03.771Z",
    "updatedAt": "2024-08-12T07:37:03.771Z",
  }],
```

## Note
`jumpTp`字段（前端快速定位用）:
* `global`类型消息无此字段
* `comment_reply` 类型消息此字段内容为`/post/postId/comments/commentId`，其中`postId`为回复的帖子`id`，`commentId`为回复产生评论的`id`
* `post_created`类型消息此字段内容为`/post/postId/`，其中`postId`为新建帖子`id`，
