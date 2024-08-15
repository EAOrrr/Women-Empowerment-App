
const { Op } = require('sequelize')

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
  if (validOrderingFields.includes(ordering)) {
    return [[ordering, 'DESC'], ['id', 'ASC']]
  } else {
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


module.exports = {
  encodeCursor,
  decodeCursor,
  // buildWhereClause,
  buildPaginationCondition,
  buildOrderClause,
  generateCursor,
  generateExpiration
}