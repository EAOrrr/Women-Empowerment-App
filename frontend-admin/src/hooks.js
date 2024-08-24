import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import articleService from './services/articles'
import { clearArticles, setArticles } from './reducers/articlesReducer'
import { useLocation } from 'react-router-dom'


export const useField = (label, type='text') => {
  const [value, setValue] = useState('')
  const autoComplete = label

  const onChange =  (event) => {
    setValue(event.target.value)
  }

  const onReset = () => {
    setValue('')
  }

  return {
    label,
    type,
    value,
    autoComplete,
    onChange,
    onReset
  }
}



// const useArticles = (page, ordering, type) => {
//   const dispatch = useDispatch()
//   const [articles, setArticles] = useState([]);
//   const [totalPage, setTotalPage] = useState(0);


//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`/api/articles?page=${page}&ordering=${ordering}&type=${type}&limit=12&total=true`);
//         const data = await response.json();
//         setArticles(data.articles);
//         setTotalPage(data.totalPage);
//         dispatch(setArticles({
//           page: page,
//           articles: data.articles
//         }));
//       } catch (error) {
//         console.error('Failed to fetch articles', error);
//       }
//     };

//     fetchData();
//   }, [page, ordering, type]);

//   return { articles, totalPage };
// };
const ArticlePerPage = 12
export const useArticle = (page=1, ordering, type) => {
  const dispatch = useDispatch()

  const allArticles = useSelector(state => state.articles.data)
  const count = useSelector(state => state.articles.count)

  const [resetFlag, setResetFlag] = useState(false)

  const fetchArticles = useCallback(async (page, ordering, type, total = false) => {
    const query = `offset=${(page - 1) * ArticlePerPage}&ordering=${ordering}&type=${type}&limit=${ArticlePerPage}&total=${total}`
    const response = await articleService.getAll(query)
    dispatch(setArticles({
      page,
      articles: response.data,
      count: response.count 
    }))
  }, [dispatch])

  useEffect(() => {
    dispatch(clearArticles())
    setResetFlag(true)
  }, [dispatch, type, ordering])

  useEffect(() => {
    if (resetFlag) {
      fetchArticles(page, ordering, type, true)
      setResetFlag(false)
    }
  }, [resetFlag, fetchArticles, page, ordering, type])

  useEffect(() => {
    if (!allArticles[page] || !resetFlag)
      fetchArticles(page, ordering, type)
  }, [allArticles, fetchArticles, page, ordering, type, resetFlag])

  return ({
    articles: allArticles[page], 
    count
  })
}