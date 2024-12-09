const Article = require('./article')
const Comment = require('./comment')
const Follow = require('./follow')
const Image = require('./image')
const Job = require('./job')
const Notification = require('./notification')
const Post = require('./post')
const Recruitment = require('./recruitment')
const User = require('./user')

// 与数据结构相关的关联
Recruitment.hasMany(Job, )
Job.belongsTo(Recruitment, { foreignKey: 'recruitmentId' })

// 与用户发表行为有关的关联
User.hasMany(Post, )
Post.belongsTo(User, { as: 'poster', foreignKey: 'userId' })


User.hasMany(Comment,)
Comment.belongsTo(User, { as: 'commenter', foreignKey: 'userId' })

// 与评论有关的关联
Post.hasMany(Comment, {
  foreignKey: 'commentableId',
  constraints: false,
  onDelete: 'CASCADE',
  scope: {
    commentableType: 'post'
  }
})

Comment.belongsTo(Post, {
  constraints: false,
  foreignKey: 'commentableId'
})

Post.afterDestroy(async post => {
  await Comment.destroy({
    where: {
      commentableId: post.id,
      commentableType: 'post'
    }
  })
}
)


Article.hasMany(Comment, {
  foreignKey: 'commentableId',
  constraints: false,
  onDelete: 'CASCADE',
  scope: {
    commentableType: 'article'
  }
})

Comment.belongsTo(Article, {
  constraints: false,
  foreignKey: 'commentableId'
})

Article.afterDestroy(async article => {
  await Comment.destroy({
    where: {
      commentableId: article.id,
      commentableType: 'article'
    }
  })
})

Recruitment.hasMany(Comment, {
  foreignKey: 'commentableId',
  constraints: false,
  onDelete: 'CASCADE',
  scope: {
    commentableType: 'recruitment'
  }
})

Comment.belongsTo(Recruitment, {
  foreignKey: 'commentableId',
  constraints: false,
})

Recruitment.afterDestroy(async recruitment => {
  await Comment.destroy({
    where: {
      commentableId: recruitment.id,
      commentableType: 'recruitment'
    }
  })
})


Comment.addHook('afterFind', findResult => {
  if (!Array.isArray(findResult)) findResult = [findResult]
  for (const instance of findResult) {
    if (instance.commentableType === 'post' && instance.post !== undefined) {
      instance.commentable = instance.post
    }
    if (instance.commentableType === 'article' && instance.article !== undefined) {
      instance.commentable = instance.article
    }
    if (instance.commentableType === 'recruitment' && instance.recruitment !== undefined) {
      instance.commentable = instance.recruitment
    }
    // To prevent mistakes:
    delete instance.post
    delete instance.dataValues.post
    delete instance.article
    delete instance.dataValues.article
    delete instance.recruitment
    delete instance.dataValues.recruitment
  }
})

// 与图片有关的关联
Article.hasMany(Image, {
  foreignKey: 'referenceId',
  constraints: false,
  scope: {
    referenceType: 'article'
  }
})
Image.belongsTo(Article, {
  foreignKey: 'referenceId',
  constraints: false,
})

Article.afterDestroy(async article => {
  await Image.destroy({
    where: {
      referenceId: article.id,
      referenceType: 'article'
    }
  })
})

Recruitment.hasMany(Image, {
  foreignKey: 'referenceId',
  constraints: false,
  scope: {
    referenceType: 'recruitment'
  }
})

Image.belongsTo(Recruitment, {
  foreignKey: 'referenceId',
  constraints: false,
})

Recruitment.afterDestroy(async recruitment => {
  await Image.destroy({
    where: {
      referenceId: recruitment.id,
      referenceType: 'recruitment'
    }
  })
})

Image.addHook('afterFind', findResult => {
  if (!findResult) {
    // 如果没有查询到数据，直接返回
    console.log('No results found, skipping afterFind hook.')
    return
  }
  if (!Array.isArray(findResult)) findResult = [findResult]
  for (const instance of findResult) {
    if (instance.referenceType === 'article' && instance.article !== undefined) {
      instance.reference = instance.article
    }
    if (instance.referenceType === 'recruitment' && instance.recruitment !== undefined) {
      instance.reference = instance.recruitment
    }
    // To prevent mistakes:
    delete instance.article
    delete instance.dataValues.article
    delete instance.recruitment
    delete instance.dataValues.recruitment
  }
})

// 与通知有关的关联
User.hasMany(Notification, {
  onDelete: 'cascade',
})
Notification.belongsTo(User, { as: 'notifiedUser', foreignKey: 'userId' })



// 与用户关注有关的关联
User.belongsToMany(Article, {
  through: {
    model: Follow,
    unique: false,
    scope: {
      followableType: 'article'
    }
  },
  constraints: false,
  as: 'followableArticles',
  foreignKey: 'followerId',
})

Article.belongsToMany(User, {
  through: {
    model: Follow,
    unique: false
  },
  as: 'follower',
  constraints: false,
  foreignKey: 'followableId',
})

User.belongsToMany(Post, {
  through: {
    model: Follow,
    unique: false,
    scope: {
      followableType: 'post'
    }
  },
  constraints: false,
  as: 'followablePosts',
  foreignKey: 'followerId',
})

Post.belongsToMany(User, {
  through: {
    model: Follow,
    unique: false
  },
  as: 'follower',
  constraints: false,
  foreignKey: 'followableId',
})

User.belongsToMany(Recruitment, {
  through: {
    model: Follow,
    unique: false,
    scope: {
      followableType: 'recruitment'
    }
  },
  constraints: false,
  as: 'followableRecruitments',
  foreignKey: 'followerId',
})

Recruitment.belongsToMany(User, {
  through: {
    model: Follow,
    unique: false
  },
  as: 'follower',
  constraints: false,
  foreignKey: 'followableId',
})


module.exports = {
  Article,
  Comment,
  Follow,
  Image,
  Job,
  Notification,
  Post,
  Recruitment,
  User
}