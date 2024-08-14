# 获取特定id图片

获取特定id图片

**URL** : `/imageUrl/{id}`

**Method** : `GET`

**Auth required** : YES

**Permissions required** : 仅管理员

**Data constraints** : `{}`

## Success Responses

**Code** : `200 OK`

**Content example**

回的内容是图像文件本身，响应头包含适当的 `Content-Type`，例如 `image/jpeg`, `image/png` 等。