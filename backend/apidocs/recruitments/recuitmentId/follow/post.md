# 收藏特定id的招聘启事

收藏特定id招聘启事

**URL** : `/api/recruitments/:id/follow`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Condition** : 用户收藏成功

**Code** : `200 OK`

**Content** : `{}`

## Error Responses

**Condition** : 找不到对应`id`的招聘启示

**Code** : `404 NOT FOUND`

**Content** : `{}`

### Or

**Condition** : 重复收藏

**Code** : `409 CONFLICT`

**Content** : 
```json
{ error: 'Already followed' }
```