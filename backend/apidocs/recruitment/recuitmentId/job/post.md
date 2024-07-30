# 增加特定id的招聘启事的工种

增加特定id的招聘启事的工种

**URL** : `/api/recruitments/:recruitmentId/jobs

**Method** : `POST`

**Auth required** : YES

**Permissions required** : 仅发帖者

**Data constraints** : 
新增加的职业

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

## Success Responses

**Code** : `201 Created`

**Content** : 

```json
{
  "id": "评论id",
  "content": "评论内容",
  "likes": 0, // 初始化为0
  "commenter": {
    "userId": "123456",
    "username": "human",
  },
  "createdAt": "2024-07-30T04:31:55.614Z", 
  "updatedAt": "2024-07-30T04:31:55.614Z",
}
```

## Error Responses

**Condition** : 用户权限不足

**Code** : `403 Forbidden`

**Content** : 
```json
{
  "error": "You do not have permission to perform this action."
}
```

### Or

**Condition** : 找不到对应`id`的留言

**Code** : `404 NOT FOUND`

**Content** : `{}`