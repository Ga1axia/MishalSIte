import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './theme/ThemeProvider'
import { ContentProvider } from './context/ContentContext'
import { AdminAuthProvider } from './admin/AdminAuthContext'
import App from './App'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ContentProvider>
          <AdminAuthProvider>
            <App />
          </AdminAuthProvider>
        </ContentProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
