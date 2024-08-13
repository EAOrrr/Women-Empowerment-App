# 显示特定id的招聘启事

显示特定id招聘启事

**URL** : `/api/recruitments/:id`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Condition** : 用户可以看到当前id的招聘启事

**Code** : `200 OK`

**Content** : 

```json
{
  "id": "招聘启事id",
  "title": "招聘启事标题", 
  "name": "企业名称",
  "intro": "招聘企业介绍", 
  // "addr" 必填
  "province": "企业所在省份",
  "city": "企业所在城市",
  "district": "企业所在区/县",
  "street": "企业所在街道",
  "address": "企业具体地址",
  "phone": "企业联系电话", 
  "jobs": [ 
    {
      "job": "职业名称",  
      "intro": "职业介绍", 
      "lowerBound": 123,
      "upperBound": 345, 
    }
  ],
  "comments": [
    {
      "id": "评论的id", 
      "content": "评论的内容", 
      "likes": 7,
      "commenter": {
        "username": "another human" // 评论者的资料
      }
    }
  ]
}
```
## Error Responses

**Condition** : 找不到对应`id`的招聘启示

**Code** : `404 NOT FOUND`

**Content** : `{}`