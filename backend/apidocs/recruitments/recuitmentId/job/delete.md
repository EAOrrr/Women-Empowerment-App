# 删除特定recruitment下的特定jobId职业

删除特定recruitment下的特定jobId职业

**URL** : `/api/recruitments/:recruitmentId/jobs/:jobId`

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : 仅发帖者可修改

**Data constraints** : `{}`

## Success Responses

**Code** : `204 NO CONTENT`

**Content** : `{}`
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

**Condition** : 对应的`postId`不存在对应帖子或`commentId`不存在对应评论

**Code** : `404 NOT FOUND`

**Content** : `{}`

### Or

**Condition** : `jobId`对应的评论并不是`recruitmetnId`对应的留言下的职业

**Code** : `400 BAD REQUEST`

**Content** : 
```json
{
  "error": "The comment does not belong to the specified post."
}
```