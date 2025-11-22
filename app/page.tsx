// app/page.tsx
'use client'
import React, { useEffect } from 'react'
import Navbar from './src/components/NavBar'
import UserList from './src/components/UserList'
import { fetchUsersPage } from './src/components/lib/axios'
import { useQueryClient } from '@tanstack/react-query'
import { useUsersStore } from './src/components/store/UserStore'
import ActivityLog from './src/components/ActivityLog'

export default function HomePage() {
  const qc = useQueryClient()
  const setCurrentUser = useUsersStore(s => s.setCurrentUser)
  const setUsers = useUsersStore(s => s.setUsers)

  useEffect(() => {
    (async ()=>{
      try {
        const res = await fetchUsersPage({ page:1, pageSize: 100 })
        setUsers(res.all)
        if (res.all.length) setCurrentUser(res.all[0])
        qc.setQueryData(['users', 1], res)
      } catch(e) {}
    })()
  }, [qc, setCurrentUser, setUsers])

  return (
    <div>
      

      {/* -------- MAIN LAYOUT FIXED ---------- */}
      <main className="p-4 flex gap-4">
        {/* LEFT CONTENT */}
        <div className="flex-1">
           <ActivityLog />
        </div>

        {/* RIGHT SIDEBAR */}
       
        <UserList />
      </main>
    </div>
  )
}
