/*
 MSW handlers using MSW 2.0 `http` helpers.
 This file provides an in-memory mock for Todos and Comments so the frontend can work
 without a running backend.

 Endpoints mocked:
 - GET  /todos
 - POST /todos
 - GET  /todos/:id
 - POST /todos/:id/comments

 NOTE: The frontend expects the API surface defined in src/hooks/useApi.ts
 (paths like /todos, /todos/:id, /todos/:id/comments). Keep them in sync.
*/

import { http } from 'msw'

// In-memory storage for demo purposes.
// Keep shapes close to the OpenAPI schemas (id, title, description, created_by, created_at, updated_at, tags)
let nextTodoId = 3
const todos: Array<any> = [
  {
    id: 1,
    title: 'Buy groceries',
    description: 'Milk, eggs, bread',
    status: 'todo',
    priority: 'medium',
    due_date: null,
    assignee_id: null,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [],
  },
  {
    id: 2,
    title: 'Read Design System',
    description: 'Review DESIGN-nexus-productivity.md',
    status: 'todo',
    priority: 'low',
    due_date: null,
    assignee_id: null,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: [],
  },
]

let nextCommentId = 3
const commentsByTodoId: Record<number, Array<any>> = {
  1: [
    { id: 1, todo_id: 1, author_id: 2, content: 'Don\'t forget cheese', created_at: new Date().toISOString() },
  ],
  2: [
    { id: 2, todo_id: 2, author_id: 3, content: 'Great read!', created_at: new Date().toISOString() },
  ],
}

export const handlers = [
  // List todos
  http.get('/todos', (req, res, ctx) => {
    // Simulate small delay
    return res(ctx.delay(250), ctx.json(todos))
  }),

  // Create todo
  http.post('/todos', async (req, res, ctx) => {
    try {
      const body = await req.json()
      // Basic validation similar to API: require title and created_by
      if (!body || !body.title || !body.created_by) {
        return res(
          ctx.status(400),
          ctx.json({ message: 'title and created_by are required' })
        )
      }

      const newTodo = {
        id: nextTodoId++,
        title: body.title,
        description: body.description ?? null,
        status: body.status ?? 'todo',
        priority: body.priority ?? 'medium',
        due_date: body.due_date ?? null,
        assignee_id: body.assignee_id ?? null,
        created_by: body.created_by,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: body.tags ?? [],
      }

      todos.unshift(newTodo)
      // ensure comments bucket exists
      commentsByTodoId[newTodo.id] = []

      return res(ctx.status(201), ctx.json(newTodo))
    } catch (e) {
      return res(ctx.status(500), ctx.json({ message: 'invalid json' }))
    }
  }),

  // Get todo detail (include comments array)
  http.get('/todos/:id', (req, res, ctx) => {
    const id = Number(req.params.id)
    const todo = todos.find((t) => t.id === id)
    if (!todo) return res(ctx.status(404), ctx.json({ message: 'Not found' }))

    const todoComments = commentsByTodoId[id] ?? []
    // Return todo with comments embedded (friendly for UI)
    return res(
      ctx.delay(150),
      ctx.json({ ...todo, comments: todoComments })
    )
  }),

  // Create a comment for a todo
  http.post('/todos/:id/comments', async (req, res, ctx) => {
    const id = Number(req.params.id)
    const todo = todos.find((t) => t.id === id)
    if (!todo) return res(ctx.status(404), ctx.json({ message: 'Todo not found' }))

    try {
      const body = await req.json()
      if (!body || !body.author_id || !body.content) {
        return res(ctx.status(400), ctx.json({ message: 'author_id and content are required' }))
      }

      const newComment = {
        id: nextCommentId++,
        todo_id: id,
        author_id: body.author_id,
        content: body.content,
        created_at: new Date().toISOString(),
      }

      if (!commentsByTodoId[id]) commentsByTodoId[id] = []
      commentsByTodoId[id].push(newComment)

      return res(ctx.status(201), ctx.json(newComment))
    } catch (e) {
      return res(ctx.status(500), ctx.json({ message: 'invalid json' }))
    }
  }),
]
