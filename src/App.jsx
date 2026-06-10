import { useEffect } from 'react'
import { Routes, Route, useLocation, Outlet } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import PaletteToggler from './components/PaletteToggler'
import ContentLoading from './components/ContentLoading'
import { useContent } from './context/ContentContext'
import Home from './pages/Home'
import Exhibitions from './pages/Exhibitions'
import ExhibitionDetail from './pages/ExhibitionDetail'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Artists from './pages/Artists'
import ArtistDetail from './pages/ArtistDetail'
import Opportunities from './pages/Opportunities'
import OpportunityDetail from './pages/OpportunityDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminResourceList from './admin/AdminResourceList'
import AdminResourceEdit from './admin/AdminResourceEdit'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

function PublicLayout() {
  const location = useLocation()
  const { loading } = useContent()

  return (
    <>
      <ScrollManager />
      <Nav />
      <main className="page" key={location.pathname}>
        {loading ? <ContentLoading /> : <Outlet />}
      </main>
      <Footer />
      <PaletteToggler />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin">
        <Route index element={<AdminLogin />} />
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path=":resource" element={<AdminResourceList />} />
          <Route path=":resource/:id" element={<AdminResourceEdit />} />
        </Route>
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/exhibitions" element={<Exhibitions />} />
        <Route path="/exhibitions/:slug" element={<ExhibitionDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/artists/:slug" element={<ArtistDetail />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/opportunities/:slug" element={<OpportunityDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
