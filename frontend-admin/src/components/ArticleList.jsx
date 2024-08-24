import ArticleCard from './ArticleCard'

const ArticleList = ({ articles }) => {
  if (!articles) {
    return <div>Loading...</div>
  }
  return (
    <div>
      {/* <h2>Articles List</h2> */}
      {articles.map(article =>
        <ArticleCard key={article.id} article={article} />
      )}
    </div>
  )
}

export default ArticleList