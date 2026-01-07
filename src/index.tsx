import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'

const rootEl = document.getElementById('root')

console.log('@import.meta.env.PUBLIC_API_URL', import.meta.env.PUBLIC_API_URL)
console.log(
  '@import.meta.env.PUBLIC_SOME_FLAG',
  import.meta.env.PUBLIC_SOME_FLAG,
)

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
