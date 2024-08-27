# 取消收藏特定id的留言

取消特定id留言

**URL** : `/api/recruitments/:id/follow`

**Method** : `DELETE`

**Auth required** : YES

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Condition** : 用户取消收藏成功

**Code** : `204 NO CONTENT`

**Content** : `{}`

## Error Responses

**Condition** : 找不到对应`id`的留言

**Code** : `404 NOT FOUND`

**Content** : `{}`