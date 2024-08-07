const Article = require('../models/article')
const User = require('../models/user')

const initialArticles = [
  {
    'id': '61c95099-031e-4f60-adcf-08deea328620',
    'views': 0,
    'likes': 0,
    'title': 'first article',
    'content': 'content of first article',
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
    'type': 'law',
    'updatedAt': '2024-08-06T03:13:51.259Z',
    'createdAt': '2024-08-06T03:13:51.259Z'
  }
]

const articlesInDb = async () => {
  const articles = await Article.findAll()
  return articles.map(article => article.toJSON())
}

const usersInDb = async () => {
  const users = await User.findAll()
  return users.map(u => u.toJSON())
}

const nonExistingId = async () => {
  const article = await Article.create({
    title: 'willremovethissoon',
    content: 'content of willremovethissoon',
    type: 'policy',
  })
  const id = article.id
  await article.destroy()
  return id
}


module.exports = {
  initialArticles,
  articlesInDb,
  usersInDb,
  nonExistingId,
}