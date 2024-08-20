import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'



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
