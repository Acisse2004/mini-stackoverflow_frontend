import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function PageLayout({ children, onSearch, onTagClick }) {
  return (
    <div className="app-wrapper">
      <Navbar onSearch={onSearch} />
      <div className="app-body">
        <Sidebar onTagClick={onTagClick} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}