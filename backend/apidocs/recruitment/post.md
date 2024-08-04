# 发布新招聘启事

发布新招聘启事

**URL** : `/api/recruitments/`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : None

**Data constraints** : 
```json
{
  "title": "招聘启事标题", // 必填，要求唯一（与其他人的标题不能相同）
  "name": "企业名称",
  "intro": "招聘企业介绍", // 必填，字数限制：50~200
  // addr, 必填
  "province": "企业所在省份",
  "city": "企业所在城市",
  "district": "企业所在区/县",
  "street": "企业所在街道",
  "address": "企业具体地址", 
  "phone": "企业联系电话", // 必填
  "jobs": [ // 职业列表，每个职业格式同第一个
    {
      "job": "职业名称",  // 必填
      "intro": "职业介绍", // 必填
      "salary": {
        "lowerBound": 123, // 必填，整型，工资下限
        "upperBound": 345, // 必填，整型，工资上限
      }
    }
  ]
}
```

## Success Responses

**Code** : `201 Created`

**Content** : 

```json
{
  "id": "招聘启事id，格式为uuid",
  "title": "招聘启事标题", 
  "intro": "招聘企业介绍", 
  "name": "招聘企业名称",
  "addr": {  
    "province": "企业所在省份",
    "city": "企业所在城市",
    "street": "企业所在街道",
    "detail": "企业具体地址"
  },
  "phone": "企业联系电话", 
  "jobs": [ 
    {
      "job": "职业名称",  
      "intro": "职业介绍", 
      "salary": {
        "lowerBound": 123, 
        "upperBound": 345,
      }
    }
  ],
  "likes": 0, // 初始化为0
  "views": 0, // 初始化为0
  "poster": { // 发帖者资料
    "username": "human", 
  },
}
```