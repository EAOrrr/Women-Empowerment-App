require('dotenv').config()
const DATABASE_URL = process.env.DATABASE_URL
const PORT = process.env.PORT
// const SECRET = process.env.SECRET
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const WECHAT_APPID = process.env.WECHAT_APPID
const WECHAT_SECRET = process.env.WECHAT_SECRET
module.exports = {
  DATABASE_URL,
  PORT,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  WECHAT_APPID,
  WECHAT_SECRET,
}