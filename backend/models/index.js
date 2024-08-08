const Article = require('./article')
const Comment = require('./comment')
const Follow = require('./follow')
const Job = require('./job')
const Notification = require('./notification')
const Post = require('./post')
const Recruitment = require('./recruitment')
const User = require('./user')

// 与用户发表行为有关的关联
User.hasMany(Post, )
Post.belongsTo(User, { as: 'poster', foreignKey: 'userId' })


User.hasMany(Comment,)
Comment.belongsTo(User, { as: 'commenter', foreignKey: 'userId' })

/*
User.hasMany(Notification, {foreignKey: 'userId'})
Notification.belongsTo(User, {foreignKey: 'notificationId'})

*/
// 与评论有关的关联
Post.hasMany(Comment, {
  foreignKey: 'commentableId',
  constraints: false,
  scope: {
    commentableType: 'post'
  }
})

Comment.belongsTo(Post, {
  constraints: false,
  foreignKey: 'commentableId'
})

/*
Article.hasMany(Comment, {
  foreignKey: 'commentableId',
  constraints: false,
  scope: {
    commentable: 'article'
  }
})
Comment.belongsTo(Article, {
  constraints: false,
  foreignKey: 'commentableId'
})

Recruitment.hasMany(Comment, {
  foreignKey: 'commentableId',
  constraints: false,
  scope: {
    commentable: 'recruitment'
  }
})
Comment.belongsTo(Recruitment, {
  foreignKey: 'commentableId',
  constraints: false,
})
*/

Comment.addHook('afterFind', findResult => {
  if (!Array.isArray(findResult)) findResult = [findResult]
  for (const instance of findResult) {
    if (instance.commentableType === 'post' && instance.post !== undefined) {
      instance.commentable = instance.post
    }
    // To prevent mistakes:
    delete instance.post
    delete instance.dataValues.post
  }
})
/*

// 与用户关注有关的关联
User.belongsToMany(Article, {
  through: Follow,
  as: 'likes'
})

Article.belongsToMany(User, {
  through: 'user_article_likes',
  as: 'likers'
})
*/

module.exports = {
  Article,
  Comment,
  Follow,
  Job,
  Notification,
  Post,
  Recruitment,
  User
}