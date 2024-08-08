const { Article, User, Post, Comment } = require('../models')

const initialArticles = [
  {
    'id': '61c95099-031e-4f60-adcf-08deea328620',
    'views': 0,
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
    'views': 0,
    'likes': 0,
    'title': 'second article',
    'content': 'content of second article',
    'abstract': 'content of second article',
    'type': 'law',
    'updatedAt': '2024-08-06T03:13:51.259Z',
    'createdAt': '2024-08-06T03:13:51.259Z'
  }
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


module.exports = {
  initialArticles,
  initialPosts,
  newComments,
  articlesInDb,
  usersInDb,
  postsInDb,
  commentsInDb,
  nonExistingId,
}