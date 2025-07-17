import React, { useState } from 'react'
import './App.css'
import Main from './components/Main'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import CompletedTasks from './components/CompletedTasks'
import Analytics from './components/Analytics.jsx'
import Header from './components/Header'
import HeaderMobile from './components/HeaderMobile'
import { useViewport } from './components/useViewport'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const { isMobile } = useViewport()

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard/>
      case 'tasks': return <Tasks/>
      case 'completed': return <CompletedTasks/>
      case 'analytics': return <Analytics/>
      default: return <Dashboard/>
    }
  }

  const renderHeader = () => {
    return isMobile ? 
      <HeaderMobile setCurrentPage={setCurrentPage} /> : 
      <Header setCurrentPage={setCurrentPage} />
  }

  return (
    <div className="app">
      {renderHeader()}
      <Main className="main-content overflow-hidden overflow-y-auto h-full">
        {renderPage()}
      </Main>
    </div>
  )
}

export default App
