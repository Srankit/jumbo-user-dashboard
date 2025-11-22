// app/lib/axios.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: { 'Content-Type': 'application/json' }
})

export type UserAPI = {
  id: number
  name: string
  email: string
  phone: string
  company?: { name: string }
  address?: { street?: string; city?: string; zipcode?: string }
}

// fetch page-based: since API doesn't support pagination, we fetch all and slice here.
// React Query will manage keepPreviousData for page changes.
export const fetchUsersPage = async ({ page = 1, pageSize = 5 } : { page?: number; pageSize?: number }) => {
  const res = await api.get<UserAPI[]>('/users')
  const all = res.data
  const start = (page - 1) * pageSize
  return { total: all.length, users: all.slice(start, start + pageSize), all }
}

export const fetchUserById = async (id: number) => {
  const res = await api.get<UserAPI>(`/users/${id}`)
  return res.data
}

export const createUserAPI = async (payload: Partial<UserAPI>) => {
  const res = await api.post('/users', payload)
  return res.data
}

export const updateUserAPI = async (id:number, payload: Partial<UserAPI>) => {
  const res = await api.put(`/users/${id}`, payload)
  return res.data
}

export const deleteUserAPI = async (id: number) => {
  const res = await api.delete(`/users/${id}`)
  return res.data
}
