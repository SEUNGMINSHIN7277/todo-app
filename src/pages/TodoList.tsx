import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../hooks/useApi'

export default function TodoList() {
  const [todos, setTodos] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.getTodos().then((data) => setTodos(data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  async function create() {
    if (!title) return
    const payload = { title, created_by: 1 }
    try {
      const t = await api.createTodo(payload)
      setTodos((s) => [t, ...s])
      setTitle('')
    } catch (err) {
      alert('Failed to create')
    }
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input className="border p-2 rounded flex-1" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New todo" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={create}>Add</button>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="grid gap-3">
          {todos.map((t) => (
            <Link key={t.id} to={`/todos/${t.id}`} className="card block">
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm text-gray-500">{t.description}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
