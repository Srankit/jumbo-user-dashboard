// UserList.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import UserFormModal from "./UserModel";
import DeleteConfirm from "./DeleteConfirm";
import type { UserAPI } from "./lib/axios";
import { useUsersStore } from "./store/UserStore";

const fetchUsers = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  return res.json();
};

// Mock API calls for create, update, and delete
const createUser = async (userData: Omit<UserAPI, "id">): Promise<UserAPI> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000) + 100,
        ...userData,
      });
    }, 500);
  });
};

const updateUser = async (id: number, userData: Partial<UserAPI>): Promise<UserAPI> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        ...userData,
      } as UserAPI);
    }, 500);
  });
};

// Delete user API call
const deleteUser = async (id: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();

export default function UserList() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const pushLog = useUsersStore((s) => s.pushLog);

  const [search, setSearch] = useState("");
  const [sortEmail, setSortEmail] = useState<"asc" | "desc" | "">("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAPI | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Create user mutation with optimistic update
  const createMutation = useMutation({
    mutationFn: createUser,
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old: UserAPI[] = []) => [
        { ...newUser, id: Date.now() },
        ...old,
      ]);

      pushLog(`Adding new user: ${newUser.name}`);
      return { previousUsers };
    },
    onError: (err, newUser, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers);
      pushLog(`Error adding user: ${newUser.name}`);
    },
    onSuccess: (result, newUser) => {
      queryClient.setQueryData(['users'], (old: UserAPI[] = []) => 
        old.map(user => 
          user.name === newUser.name && user.email === newUser.email 
            ? result 
            : user
        )
      );
      pushLog(`Successfully added user: ${result.name}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Update user mutation with optimistic update
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserAPI> }) => 
      updateUser(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old: UserAPI[] = []) =>
        old.map(user =>
          user.id === id ? { ...user, ...data } : user
        )
      );

      pushLog(`Updating user ID: ${id}`);
      return { previousUsers };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers);
      pushLog(`Error updating user ID: ${variables.id}`);
    },
    onSuccess: (result, variables) => {
      pushLog(`Successfully updated user ID: ${variables.id}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Delete user mutation with optimistic update
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previousUsers = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old: UserAPI[] = []) =>
        old.filter(user => user.id !== id)
      );

      pushLog(`Deleting user ID: ${id}`);
      return { previousUsers };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['users'], context?.previousUsers);
      pushLog(`Error deleting user ID: ${id}`);
    },
    onSuccess: (_, id) => {
      pushLog(`Successfully deleted user ID: ${id}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId);
    setDeleteId(null);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setOpen(true);
    pushLog("Opening add user form");
  };

  const handleEditUser = (user: UserAPI) => {
    setSelectedUser(user);
    setOpen(true);
    pushLog(`Editing user: ${user.name}`);
  };

  // Add this function to handle row click
  const handleRowClick = (user: UserAPI) => {
    router.push(`/users/${user.id}`);
    pushLog(`Viewing user details: ${user.name}`);
  };

  const companyList = useMemo(() => {
    if (!users) return [];
    return Array.from(new Set(users.map((u: any) => u.company.name)));
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    let list = [...users];

    list = list.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );

    if (companyFilter !== "all") {
      list = list.filter((u) => u.company.name === companyFilter);
    }

    if (sortEmail === "asc") list.sort((a, b) => a.email.localeCompare(b.email));
    if (sortEmail === "desc") list.sort((a, b) => b.email.localeCompare(a.email));

    return list;
  }, [users, search, sortEmail, companyFilter]);

  if (isLoading) return <p className="p-6 text-center text-lg">Loading users...</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">User Management Dashboard</h2>

      {/* Add User Button and Filters */}
      <div className="flex justify-between items-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={handleAddUser}
        >
          Add New User
        </button>
        
        {/* Search and Filters */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search users..."
            className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select
            className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          >
            <option value="all">All Companies</option>
            {companyList.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
          
          <select
            className="px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortEmail}
            onChange={(e) => setSortEmail(e.target.value as "asc" | "desc" | "")}
          >
            <option value="">Sort Email</option>
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      {filteredUsers.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredUsers.length} of {users?.length || 0} users
        </div>
      )}

      <div className="overflow-auto border rounded dark:border-gray-600">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-700 dark:text-white">
            <tr>
              <th className="p-3 border dark:border-gray-600">Avatar</th>
              <th className="p-3 border dark:border-gray-600">Name</th>
              <th className="p-3 border dark:border-gray-600">Email</th>
              <th className="p-3 border dark:border-gray-600">Phone</th>
              <th className="p-3 border dark:border-gray-600">Company</th>
              <th className="p-3 border dark:border-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user: any) => (
              <tr 
                key={user.id} 
                className="text-center dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => handleRowClick(user)}
              >
                <td className="p-3 border dark:border-gray-600">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto font-medium">
                    {getInitials(user.name)}
                  </div>
                </td>

                <td className="p-3 border dark:border-gray-600 font-medium">{user.name}</td>
                <td className="p-3 border dark:border-gray-600">{user.email}</td>
                <td className="p-3 border dark:border-gray-600">{user.phone}</td>
                <td className="p-3 border dark:border-gray-600">{user.company.name}</td>

                <td 
                  className="p-3 border dark:border-gray-600 space-x-2"
                  onClick={(e) => e.stopPropagation()} // Prevent row click when clicking buttons
                >
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                    onClick={() => setDeleteId(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">No users found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      {search || companyFilter !== "all" 
                        ? "Try adjusting your search or filters" 
                        : "No users available"
                      }
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <UserFormModal 
        open={open} 
        onOpenChange={setOpen} 
        user={selectedUser}
        onCreate={createMutation.mutate}
        onUpdate={updateMutation.mutate}
      />

      <DeleteConfirm
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={handleDelete}
      >
        Are you sure you want to delete user ID: <b>{deleteId}</b>?
        <br />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          This action cannot be undone.
        </span>
      </DeleteConfirm>
    </div>
  );
}