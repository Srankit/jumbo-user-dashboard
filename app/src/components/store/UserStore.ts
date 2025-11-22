// store/UserStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserAPI } from '../lib/axios'

type State = {
  users: UserAPI[]
  setUsers: (u: UserAPI[]) => void
  addUser: (u: UserAPI) => void
  updateUser: (id: number, data: Partial<UserAPI>) => void
  removeUser: (id: number) => void

  currentUser: UserAPI | null
  setCurrentUser: (u: UserAPI | null) => void

  activityLog: string[]
  pushLog: (msg: string) => void
  clearActivityLog: () => void

 
}

export const useUsersStore = create<State>()(
  persist(
    (set, get) => ({
      users: [],

      setUsers: (u) => set({ users: u }),

      addUser: (u) =>
        set((s) => {
          s.pushLog(`Added user: ${u.name}`);
          return { users: [u, ...s.users] };
        }),

      updateUser: (id, data) =>
        set((s) => {
          const old = s.users.find(x => x.id === id)
          s.pushLog(`Updated user: ${old?.name ?? id}`)
          return {
            users: s.users.map((x) =>
              x.id === id ? { ...x, ...data } : x
            ),
          }
        }),

      removeUser: (id) =>
        set((s) => {
          const user = s.users.find(x => x.id === id)
          s.pushLog(`Deleted user: ${user?.name ?? id}`)
          return {
            users: s.users.filter(x => x.id !== id),
          }
        }),

      currentUser: null,

      setCurrentUser: (u) => {
        if (u) get().pushLog(`Selected user: ${u.name}`);
        return set({ currentUser: u });
      },

      activityLog: [],

      pushLog: (msg) =>
        set((s) => ({
          activityLog: [
            `${new Date().toLocaleString()} — ${msg}`,
            ...s.activityLog,
          ],
        })),

      clearActivityLog: () => set({ activityLog: [] }),

     
    }),
    {
      name: 'jumbo-users-store',
      version: 4, // Bump version for new fields
    }
  )
);