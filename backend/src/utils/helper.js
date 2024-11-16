
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET } = require('./config')
const { User } = require('../models')

// Base64 编码函数
function encodeCursor(data) {
  return Buffer.from(data).toString('base64')
}

// Base64 解码函数
function decodeCursor(base64String) {
  return Buffer.from(base64String, 'base64').toString('utf-8')
}

function buildPaginationCondition(cursor) {

  const [cursorFeature, cursorValue, cursorIdStr] = decodeCursor(cursor).split(',')
  if (cursorValue === 'null') {
    return null
  }
  return {
    [Op.or]: [
      { [cursorFeature]: cursorValue, id: { [Op.gt]: cursorIdStr } },
      { [cursorFeature]: { [Op.lt]: cursorValue } },
    ]
  }
}

function generateCursor(lastArticle, feature){
  const value = lastArticle[feature]
  const stringToEncode = `${feature},${value},${lastArticle.id}`
  return encodeCursor(stringToEncode)
}

function buildOrderClause(ordering, defaultOrdering, validOrderingFields) {
  // const validOrderingFields = ['createdAt', 'likes', 'views']
  if (!ordering) return [[defaultOrdering, 'DESC'], ['id', 'ASC']]
  const orderingCamel = hyphensToCamel(ordering)
  console.log('ordering', `'${orderingCamel}'`, validOrderingFields, typeof orderingCamel)
  if (validOrderingFields.includes(orderingCamel)) {
    console.log('validOrderingFields')
    return [[orderingCamel, 'DESC'], ['id', 'ASC']]
  } else {
    console.log('invalid ordering field')
    const error = new Error('Invalid ordering field')
    error.statusCode = 400
    throw error
  }
}

function generateExpiration(baseExpiration) {
  const adjustmentRange = 1 / 60 * baseExpiration;  // 10% 的范围
  const randomAdjustment = Math.floor(Math.random() * (2 * adjustmentRange)) - adjustmentRange;

  // 最终的有效期
  const finalExpiration = baseExpiration + randomAdjustment;

  return finalExpiration;
}

function hyphensToCamel(str) {
  return str.split('-').map((word, index) => {
    if (index === 0) {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
}

function hyphensToSpaces(str) {
  return str.replace(/-/g, ' ');
}

async function decodeToken(token) {
  if (!token) {
    return null
  }
  const decodedToken =  jwt.verify(token, ACCESS_TOKEN_SECRET)
  if (!decodedToken.id) {
    return {
      status: 401,
      error: 'token invalid'
    }
  }
  const user = await User.findByPk(decodedToken.id)
  if (!user) {
    return {
      status: 401,
      error: 'user not found'
    }
  }
  return {
    status: 200,
    user: user
  }
}

module.exports = {
  encodeCursor,
  decodeCursor,
  // buildWhereClause,
  buildPaginationCondition,
  buildOrderClause,
  generateCursor,
  generateExpiration,
  hyphensToCamel,
  hyphensToSpaces,
  decodeToken,
}