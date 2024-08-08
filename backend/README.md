# RESTAPIDocs

> 当前进度： 文章功能、用户功能和留言模块可以正常使用（用户功能微信登录板块未测试）。

> 当前目标：改报错信息 + API 修改 + 文章评论 + 通知信息（收到回复 + 管理员发布信息）

> 还剩工程：招聘启示，招聘启事各职业，招聘启事的评论，收藏（Follow）功能

本地运行,在文件夹下建立.env文件中设置PORT变量，DATABASE_URL变量和SECRET变量

服务器运行端口：暂未购置服务器

**HTTP状态码**将明确指示请求结果。
- **`401 UNAUTHROIZED`** 表明令牌`token`错误，请检查并重新发送或重新登录。
- **`404 NOT FOUND`** 表示目标资源不存在，请检查发送地址是否正确。
- **`500 INTERNAL SERVER ERROR`** 表明服务器内部发生错误，请联系我协助解决。
- **其余状态码** 请参考对应接口文档获取更多信息

## 开放端点

开放端点不需要进行用户认证

* [通过微信登录](./apidocs/login/login-wechat.md) : `POST /api/login/wechat/`
> 此接口仅供调试使用<br>
> *new*: 管理员登录可用
> * [通过密码登录](./apidocs/login/login-pwd.md) : `POST /api/login/pwd/` 


## 需要用户认证的端点

关闭的端点要求在请求头中包含一个有效的令牌`token`。令牌可从上述登录视图中获取。

### 与用户`user`有关

一下每个端点都会处理或显示与用户相关的信息，发送请求时要求提供用户的令牌`token`：
<!-- * [获取所有用户信息](./apidocs/user/get.md):
`GET /api/users` -->
* [更改用户信息](./apidocs/user/me/put.md) : `PUT /api/users/me`
* [显示对应用户信息](./apidocs/user/me/get.md) : `GET /api/users/me`
* [通过微信注册新用户](./apidocs/user/post/post-wechat.md): `POST /api/users/wechat`
> 此端口仅供调试使用
> * [通过密码注册新用户](./apidocs/user/post/post-pwd.md): `POST /api/users/pwd`

### 与文章`article`有关

文章包含政策文件、法律文件、政府活动等
以下每个端点都会处理或显示与用户有关的信息，发送请求时要求提供用户的令牌`token`（`get`方法除外）：

* [显示所有文章](./apidocs/article/get.md) : `GET /api/articles/`
* [发布一篇新的文章](./apidocs/article/post.md): `POST /api/articles/`
* [显示特定id的文章](./apidocs/article/id/get.md) : `GET /api/articles/:id`
* [修改特定id的文章](./apidocs/article/id/put.md): `PUT /api/articles/:id/`
* [删除特定id的文章](./apidocs/article/id/delete.md): `DELETE /api/articles/:id/`

### 与留言和建议`post`有关

以下每个端点都会处理与显示与用户有关的信息，发送请求时要求提供用户的令牌`token`（`get`方法除外）

* [显示所有留言](./apidocs/post/get.md) : `GET /api/posts/`
* [发布一篇新的留言](./apidocs/post/post.md): `POST /api/posts/`
* [显示特定id的留言](./apidocs/post/postId/get.md) : `GET /api/posts/:id`
* [修改特定id的留言](./apidocs/post/postId/put.md): `PUT /api/posts/:id/`
* [删除特定id的留言](./apidocs/post/postId/delete.md): `DELETE /api/posts/:id/`
* [在特定id留言下发布评论](./apidocs/post/postId/comment/post.md): `POST /api/posts/:postId/comments/`
* [修改特定postId下的特定commentId评论](./apidocs/post/postId/comment/put.md): `PUT /api/posts/:postId/commments/:commentId/`
<!-- * [删除postId下的特定commentId评论](): `DELETE /api/posts/:postId/commments/:commentId/` -->

### 与招聘帖子`Recuitment`有关
以下每个端点都会处理与显示与用户有关的信息，发送请求时要求提供用户的令牌`token`（`get`方法除外）
* [显示所有招聘启事](./apidocs/recruitment/get.md) : `GET /api/recruitments/`
* [发布一篇新的招聘启事](./apidocs/recruitment/post.md): `POST /api/recruitments/`
* [显示特定id的招聘启事](./apidocs/recruitment/recuitmentId/get.md) : `GET /api/recruitments/:id`
* [修改特定id的招聘启事](./apidocs/recruitment/recuitmentId/put.md): `PUT /api/recruitments/:id/`
* [删除特定id的招聘启事](./apidocs/recruitment/recuitmentId/delete.md): `DELETE /api/recruitments/:id/`
* [增加特定id的招聘启事的工种](./apidocs/recruitment/recuitmentId/job/post.md): `POST /api/recruitments/:id/jobs`
* [修改特定recruitmentId的招聘启事的特定jobId工种](./apidocs/recruitment/recuitmentId/job/put.md): `PUT /api/recruitments/:recruitmentId/jobs/jobId`
* [删除recruitmentId的招聘启事的特定jobId工种](./apidocs/recruitment/recuitmentId/job/delete.md): `DELETE /api/recruitments/:recruitmentId/jobs/jobId`
* [在特定id招聘启事下发布评论](./apidocs/recruitment//recuitmentId/comment/post.md): `POST /api/recruitments/:recuitmentId/comments/`
* [修改特定recuitmentId下的特定commentId评论](./apidocs/recruitment/recuitmentId/comment/put.md): `PUT /api/recruitments/:recuitmentId/commments/:commentId/`
<!-- * [删除recuitmentId下的特定commentId评论](): `DELETE /api/recruitments/:recuitmentId/commments/:commentId/` -->