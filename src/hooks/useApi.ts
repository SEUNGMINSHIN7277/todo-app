const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function request(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const api = {
  getTodos: () => request('/todos'),
  createTodo: (payload: any) => request('/todos', { method: 'POST', body: JSON.stringify(payload) }),
  getTodo: (id: number) => request(`/todos/${id}`),
  updateTodo: (id: number, payload: any) => request(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteTodo: (id: number) => request(`/todos/${id}`, { method: 'DELETE' }),
  getComments: (todoId: number) => request(`/todos/${todoId}/comments`),
  createComment: (todoId: number, payload: any) => request(`/todos/${todoId}/comments`, { method: 'POST', body: JSON.stringify(payload) }),
}
