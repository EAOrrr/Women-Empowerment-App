# 取消收藏特定id的招聘启事

取消特定id招聘启事

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

**Condition** : 找不到对应`id`的招聘启示

**Code** : `404 NOT FOUND`

**Content** : `{}`