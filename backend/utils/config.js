require('dotenv').config()
const DATABASE_URL = process.env.DATABASE_URL
const PORT = process.env.PORT
const SECRET = process.env.SECRET
const WECHAT_APPID = process.env.WECHAT_APPID
const WECHAT_SECRET = process.env.WECHAT_SECRET
module.exports = {
  DATABASE_URL,
  PORT,
  SECRET,
  WECHAT_APPID,
  WECHAT_SECRET,
}