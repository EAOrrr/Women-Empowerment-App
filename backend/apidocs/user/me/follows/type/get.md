# 获取当前已验证用户的对应`TYPE`收藏内容

 获取当前已验证用户的对应`type`收藏内容

**URL** : `/api/user/me/follows/:type`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : None

## Success Response

**Code** : `200 OK`

**Content examples**

若`type`为`articles`
  ```json
  [
    {
      "id": "文章id，格式为uuid",
      "title": "文章标题",
      "abstract": "文章大纲",
      "content": "文章内容",
      "author" : "文章作者", // 可能为null
      "cover": "文章封面图片", // 可能为空，格式为照片
      "type": "activity", // 文章类型，分为"activity"（活动）、"policy"（政策）"law"（法律）
      "tags": ["标签1：", "标签2"]，
      "likes": 23, // 关注数
      "views": 123, // 浏览数
      "createdAt": "2024-07-30T04:31:55.614Z", 
      "updatedAt": "2024-07-30T04:31:55.614Z", 
    }
  ]
  ```
  若`type`为`posts`
  ```json
  [
    {

      "id": "帖子id，格式为uuid",
      "title": "帖子标题",
      "content": "帖子内容",
      "status": "in progress", // 帖子状态，分为"in progress"（进行中）和"done"（已完成）
      "likes": 23, // 关注数
      "views": 123, // 浏览数
      "createdAt": "2024-07-30T04:31:55.614Z", 
      "updatedAt": "2024-07-30T04:31:55.614Z", 
    }
  ]
  ```
  若`type`为`recruitments`
  ```json
  "recruitments": [{
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
  }]
}
```

