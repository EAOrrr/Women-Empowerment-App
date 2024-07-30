# 修改特定id留言

修改特定id留言

**URL** : `/api/posts/:id`

**Method** : `PUT`

**Auth required** : YES

**Permissions required** : 
1. 对于浏览数`views`和关注数`likes`，任何登录的用户都可以修改
2. 对于企业详细信息，只有发帖者可以修改
4. 评论职业`job`的修改请查看[增加职业]()和[修改职业]()

**Data constraints** : 
```json
{
  "field1": "new data1",
  "field2": "new data2"
}
```

**Data example** : 
```json
{
  "intro": "家人们谁懂啊，这个企业绝绝子"
}
```

## Success Responses

**Code** : `200 OK`

**Content** : 
修改后的帖子

```json
{
  {
  "title": "招聘启事标题", // 必填
  "intro": "家人们谁懂啊，这个企业绝绝子", 
  "addr": { 
    "province": "企业所在省份",
    "city": "企业所在城市",
    "street": "企业所在街道",
    "detail": "企业具体地址"
  },
  "phone": "企业联系电话", 
  "views": 0,
  "likes": 0,
  "poster": {
    "username": "human"
  }
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

**Condition** : 找不到对应`id`的招聘启事

**Code** : `404 NOT FOUND`

**Content** : `{}`