import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import TodoList from './pages/TodoList'
import TodoDetail from './pages/TodoDetail'
import ThemeSelector from './components/ThemeSelector'

export default function App() {
  return (
    <div>
      <header className="bg-white shadow-sm">
        <div className="container flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">Todo</Link>
          <ThemeSelector />
        </div>
      </header>
      <main className="container mt-6">
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="/todos/:id" element={<TodoDetail />} />
        </Routes>
      </main>
    </div>
  )
}
