const { Article, User, Post, Comment, Notification, Image, Draft, Follow } = require('../models')

const initialArticles = [
  {
    'id': '61c95099-031e-4f60-adcf-08deea328620',
    'views': 8,
    'likes': 0,
    'title': 'first article',
    'content': 'content of first article',
    'abstract': 'content of first article',
    'author': 'first author',
    'type': 'activity',
    'updatedAt': '2024-08-06T03:12:46.344Z',
    'createdAt': '2024-08-06T03:12:46.344Z'
  },
  {
    'id': 'ab233b3f-4516-4bf3-8fdd-fedec3c61ce9',
    'author': null,
    'views': 8,
    'likes': 0,
    'title': 'second article',
    'content': 'content of second article',
    'abstract': 'content of second article',
    'type': 'law',
    'updatedAt': '2024-08-06T03:13:51.259Z',
    'createdAt': '2024-08-06T03:13:51.259Z',
    'tags': ['tag1', 'tag2']
  }, {
    'title': 'third article first',
    'content': 'content of third article',
    'abstract': 'content of third article',
    'type': 'policy',
    'tags': ['tag1', 'tag2'],
    'views': 7,
  },
  {
    'title': 'fourth article',
    'content': 'content of fourth article',
    'abstract': 'content of fourth article',
    'type': 'policy',
    'tags': ['tag1', 'tag2'],
    'views': 6,
  },
  {
    'title': 'fifth article',
    'content': 'content of fifth article',
    'abstract': 'content of fifth article',
    'type': 'policy',
    'tags': ['tag1'],
    'views': 5,
    'author': 'first author',
  },
  {
    'title': 'sixth article',
    'content': 'content of sixth article first',
    'abstract': 'content of sixth article',
    'type': 'policy',
    'tags': ['tag1'],
    'author': 'first author',
    'views': 4,
  },
  {
    'title': 'seventh article',
    'content': 'content of seventh article',
    'abstract': 'content of seventh article',
    'type': 'policy',
    'tags': ['tag1'],
    'views': 3,
  },
  {
    'title': 'eighth article',
    'content': 'content of eighth article first',
    'abstract': 'content of eighth article',
    'type': 'policy',
    'tags': ['tag2'],
    'views': 2,
    'author': 'first author',
  },
]

const initialPosts = [
  {
    'title': 'first post',
    'content': 'content of first post',
  },
  {
    'title': 'second post',
    'content': 'content of second post',
  },
  {
    'title': 'third post',
    'content': 'content of third post',
  }
]

const articlesInDb = async () => {
  const articles = await Article.findAll()
  return articles.map(article => article.toJSON())
}

const postsInDb = async () => {
  const posts = await Post.findAll()
  return posts.map(post => post.toJSON())
}

const usersInDb = async () => {
  const users = await User.findAll()
  return users.map(u => u.toJSON())
}

const commentsInDb = async () => {
  const comments = await Comment.findAll()
  return comments.map(c => c.toJSON())
}

const notificationsInDb = async () => {
  const notifications = await Notification.findAll()
  return notifications.map(n => n.toJSON())
}

const imagesInDb = async () => {
  const images = await Image.findAll()
  return images.map(i => i.toJSON())
}

const draftsInDb = async () => {
  const drafts = await Draft.findAll()
  return drafts.map(d => d.toJSON())
}

const followsInDb = async () => {
  const follows = await Follow.findAll()
  return follows.map(f => f.toJSON())
}

const nonExistingId = async () => {
  const article = await Article.create({
    title: 'willremovethissoon',
    content: 'content of willremovethissoon',
    type: 'policy',
    abstract: 'content of willremovethissoon',
  })
  const id = article.id
  await article.destroy()
  return id
}

const getToken = async (api, user) => {
  const response = await api
    .post('/api/login/pwd')
    .send(user)
    .expect(200)
  return response.body.token
}

const newComments = [
  {
    content: 'content of first comment',
  },
  {
    content: 'content of second comment',
  },
  {
    content: 'content of third comment',
  }
]

const initialNotifications = [
  {
    message: 'first notification',
  },
  {
    message: 'second notification',
  },
  {
    message: 'third notification',
  },
]

const createUser = async (api, user) => {
  const response = await api
    .post('/api/users/pwd')
    .send(user)
    .expect(201)
  return response.body
}

module.exports = {
  initialArticles,
  initialPosts,
  initialNotifications,
  newComments,
  articlesInDb,
  usersInDb,
  postsInDb,
  commentsInDb,
  followsInDb,
  notificationsInDb,
  imagesInDb,
  draftsInDb,
  nonExistingId,
  createUser,
  getToken,
}