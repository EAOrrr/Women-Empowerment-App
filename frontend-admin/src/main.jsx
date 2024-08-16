import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { Container } from '@mui/material'

import { Provider } from 'react-redux'
import store from './store'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <Container> */}
        <App />
      {/* </Container> */}
    </Provider>
  </React.StrictMode>,
)
