import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../hooks/useApi'

export default function TodoDetail() {
  const { id } = useParams()
  const [todo, setTodo] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    if (!id) return
    api.getTodo(Number(id)).then(setTodo).catch(console.error)
    api.getComments(Number(id)).then(setComments).catch(console.error)
  }, [id])

  async function addComment() {
    if (!newComment) return
    try {
      const c = await api.createComment(Number(id), { author_id: 1, content: newComment })
      setComments((s) => [...s, c])
      setNewComment('')
    } catch (err) {
      alert('Failed to add comment')
    }
  }

  if (!todo) return <div>Loading...</div>

  return (
    <div>
      <div className="card mb-4">
        <h2 className="text-2xl font-semibold">{todo.title}</h2>
        <p className="text-gray-600">{todo.description}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Comments</h3>
        <div className="grid gap-2 mt-2">
          {comments.map((c) => (
            <div key={c.id} className="card">
              <div className="text-sm text-gray-700">{c.content}</div>
              <div className="text-xs text-gray-400">by {c.author_id} • {new Date(c.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input className="border p-2 rounded flex-1" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={addComment}>Send</button>
      </div>
    </div>
  )
}
