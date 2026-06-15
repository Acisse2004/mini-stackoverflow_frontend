import Navbar from './Navbar'
import Sidebar from './Sidebar'

// Ce composant enveloppe toutes les pages avec la Navbar et la Sidebar
export default function PageLayout({ children }) {
  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}