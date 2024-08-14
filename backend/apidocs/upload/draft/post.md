# 上传编辑中的文档草稿

上传编辑中的文档草稿

**URL** : `/api/upload/draft`

**Method** : `POST`

**Auth required** : YES

**Permissions required** : 仅管理员可用

**Data constraints** : 
`content` 都不可为空
```json
{
  "content": "TIPTAP 导出生成的 JSON"
}
```

## Success Responses

**Code** : `201 Created`

**Content** : 

```json
{
  "id": "草稿id",
  "content": "草稿内容 ",
  "createdAt": "2024-07-30T04:31:55.614Z", 
  "updatedAt": "2024-07-30T04:31:55.614Z",
}
```