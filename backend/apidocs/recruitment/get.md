# 显示所有招聘启事

显示所有招聘启事

**URL** : `/api/recruitments/`

**Method** : `GET`

**Auth required** : NO

**Permissions required** : None

**Data constraints** : `{}`

## Success Responses

**Condition** : User can see one or more posts.

**Code** : `200 OK`

**Content** : 

```json
[  // 招聘启事列表
    {
      "id": "招聘启事id，格式为uuid",
      "title": "招聘启事标题",
      "name": "招聘企业名称",
      "intro": "招聘企业介绍",
      "addr": {  //招聘企业地址"
        "province": "企业所在省份",
        "city": "企业所在城市",
        "street": "企业所在街道",
        "detail": "企业具体地址"
      },
      "status": "in progress", // 帖子状态，分为"in progress"（进行中）和"done"（已完成）
      "likes": 23, // 关注数
      "views": 123, // 浏览数
      
      "jobs": [
        {
          "job": "职业名称1"
        },
        {
          "job": "职业名称2"
        }
      ],
      "createdAt": "2024-07-30T04:31:55.614Z", 
      "updatedAt": "2024-07-30T04:31:55.614Z", 
      "numberOfComments":3 
    }
]
```
