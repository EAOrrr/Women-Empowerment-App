# Women-Empowerment-App
此项目为百千万工程职业女性相关课题的微信小程序

## 描述

* **心声直达**： 村民朋友们，您有话想对村委会说吗？在这里，您的每一句留言都会被认真对待，问题将得到及时反馈，心声将被悉心聆听。
* **就业帮扶**： 村委会定期发布最新招聘信息，让您在家门口就能找到心仪的工作，实现就业梦想。
* **村务公开**： 村委会的工作动态、活动通知、政策解读等，一应俱全。让您随时了解村里的最新进展，参与到村庄的建设中来。
* **法律咨询**： 提供便捷的法律政策查询服务，让您足不出户就能解决法律问题，维护自身权益。
* **便民服务**： 小程序的功能将不断拓展，加入更多便民服务，让您的生活更加便利。

##  入门准备

### 依赖项

* Node.js
  下载并安装最新版本的[Node.js](https://nodejs.org/)。

* npm 
  安装 Node.js 后，npm 会自动安装。你可以使用以下命令更新 npm 到最新版本：
```
npm install npm@latest -g
```

* 微信开发者工具
  下载并安装最新版本的[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。

* 小程序依赖包
  在项目根目录下运行以下命令安装所需依赖包：
```
npm install
```

### 下载
克隆该仓库
```
git clone https://github.com/EAOrrr/Women-Empowerment-App
```


### Executing program

#### 微信小程序
TODO...

#### 后端

1. 跳转到`backend`文件夹
2. 准备一个`PostgreSQL`数据库
3. 根据以下步骤运行后端

```bash
# Install dependancies
$ npm install

# create a .env file and put there the MONGODB_URI for connecting to your postgreSQL database
$ echo "DATABASE_URL=<YOUR-DATABASE-URL>" > .env

# Set a variable SECRET which is a digital signature ensures that only parties who know the secret can generate a valid token.
$ echo "ACCESS_TOKEN_SECRET=youraccesstokensecretphrase" > .env
$ echo "REFRESH_TOKEN_SECRET=yourrefreshtokensecretphrase" > .env

# Start the application in dev environment
$ npm run dev

# Start the application in prod environment
$ npm start

# # Start the application in test environment and run tests
$ run start:test
$ npm test
```


#### 管理员前端
1. 确保你已经准备好后端并把`vite.config.js`中的`target`改为后端运行的`url`
1. 跳转到`frontent-admin`文件夹
To start an application:
1. 根据以下指引运行管理员前端
```bash
# Install dependancies
$ npm install

# Start the application in dev environment
$ npm run dev

# Build the applicatoin
$ npm build

```


## Authors

Contributors names and contact info


## Version History



## License

This project is licensed under the [NAME HERE] License - see the LICENSE.md file for details

## Acknowledgments

Inspiration, code snippets, etc.
