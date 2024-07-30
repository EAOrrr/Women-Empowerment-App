# 修改特定recruitment下的特定jobId职业

修改特定recruitment下的特定jobId职业

**URL** : `/api/recruitments/:recruitmentId/jobs/:jobId`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : 仅发帖者可修改

**Data constraints** : 
```json
{
  "salary": {
    "upperBound": 220,
    "lowerBound": 113
  }
}
```

## Success Responses

**Code** : `200 OK`

**Content** : 
修改后的职业

```json
{
  "job": "职业名称",  
  "intro": "职业介绍", 
  "salary": {
    "lowerBound": 113,
    "upperBound": 220, 
  }
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