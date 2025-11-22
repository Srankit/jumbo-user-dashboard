// UserFormModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type { UserAPI } from "./lib/axios";

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserAPI | null;
  onCreate: (userData: Omit<UserAPI, "id">) => void;
  onUpdate: (variables: { id: number; data: Partial<UserAPI> }) => void;
}

type FormShape = {
  name: string;
  email: string;
  phone: string;
  company: { name: string };
};

export default function UserFormModal({
  open,
  onOpenChange,
  user,
  onCreate,
  onUpdate,
}: UserFormModalProps) {
  const emptyForm: FormShape = {
    name: "",
    email: "",
    phone: "",
    company: { name: "" },
  };

  const [formData, setFormData] = useState<FormShape>(emptyForm);

  // Sync form when user prop or open changes.
  useEffect(() => {
    if (open && user) {
      setFormData({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        company: { name: user.company?.name ?? "" },
      });
    } else if (!open) {
      // reset on close to avoid stale data when opening to create
      setFormData(emptyForm);
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Omit<UserAPI, "id"> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: { name: formData.company.name },
    };

    if (user) {
      onUpdate({ id: user.id, data: payload });
    } else {
      onCreate(payload);
    }

    // Close the modal
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

        {/* Content (card) */}
        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 z-50
            -translate-x-1/2 -translate-y-1/2

            pointer-events-auto

            /* size & spacing */
            w-[670px] max-w-[95%]   /* fixed width with responsive fallback */
            p-[50px]

            /* rounded + bg color (deepskyblue hex) */
            rounded-[14px]
            bg-[#00bfff] dark:bg-sky-600

            /* border/shadow for card feel */
            border border-transparent
            shadow-2xl

            /* make sure content is readable */
            text-white

            focus:outline-none
          "
          aria-label={user ? "Edit user" : "Create user"}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-semibold text-white">
                {user ? "Edit User" : "Add New User"}
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-white/90">
                {user ? "Change the details and save." : "Fill details to create a new user."}
              </Dialog.Description>
            </div>

            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="inline-flex items-center justify-center rounded-md p-2 text-white/90 hover:bg-white/10"
              >
                ✕
              </button>
            </Dialog.Close>
          </div>

  <form onSubmit={handleSubmit} className="mt-6 space-y-6">

  {/* Name */}
  <div>
    <label className="block text-sm font-medium text-white/95 mb-1">Name</label>
    <input
      autoFocus
      type="text"
      required
      value={formData.name}
      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
      className="
        w-full rounded-lg
        bg-white/90 text-black
        px-3 py-3
        border border-white/80
        focus:outline-none focus:ring-2 focus:ring-white/60
      "
    />
  </div>

  {/* Email */}
  <div>
    <label className="block text-sm font-medium text-white/95 mb-1">Email</label>
    <input
      type="email"
      required
      value={formData.email}
      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
      className="
        w-full rounded-lg
        bg-white/90 text-black
        px-3 py-3
        border border-white/80
        focus:outline-none focus:ring-2 focus:ring-white/60
      "
    />
  </div>

  {/* Phone */}
  <div>
    <label className="block text-sm font-medium text-white/95 mb-1">Phone</label>
    <input
      type="tel"
      required
      value={formData.phone}
      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
      className="
        w-full rounded-lg
        bg-white/90 text-black
        px-3 py-3
        border border-white/80
        focus:outline-none focus:ring-2 focus:ring-white/60
      "
    />
  </div>

  {/* Company */}
  <div>
    <label className="block text-sm font-medium text-white/95 mb-1">Company</label>
    <input
      type="text"
      required
      value={formData.company.name}
      onChange={(e) =>
        setFormData((p) => ({ ...p, company: { name: e.target.value } }))
      }
      className="
        w-full rounded-lg
        bg-white/90 text-black
        px-3 py-3
        border border-white/80
        focus:outline-none focus:ring-2 focus:ring-white/60
      "
    />
  </div>

  {/* Buttons Centered */}
 <div className="flex justify-center gap-6 pt-6 mt-[15px]">

  <Dialog.Close asChild>
    <button
      type="button"
      className="
          px-6 py-2.5 
      rounded-lg
      bg-blue-600 text-white font-semibold
      hover:bg-blue-700
      transition
      p-[10px] ml-[230px] w-[100px] rounded-[10px]"
      onClick={() => onOpenChange(false)}
    >
      Cancel
    </button>
  </Dialog.Close>

  <button
    type="submit"
    className="
      px-6 py-2.5 
      rounded-lg
      bg-blue-600 text-white font-semibold
      hover:bg-blue-700
      transition
      p-[10px] mr-[240px] w-[100px] rounded-[10px]
    "
  >
    {user ? "Update" : "Create"}
  </button>

</div>

</form>


        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
