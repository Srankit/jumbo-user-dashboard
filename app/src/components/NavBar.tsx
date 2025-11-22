"use client";

import React from "react";
import { useUsersStore } from "./store/UserStore";
import { useThemeStore } from "./store/themeStore";
import * as Switch from "@radix-ui/react-switch";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();

export default function Navbar() {
  const { currentUser, setCurrentUser } = useUsersStore();

  // ThemeStore (FINAL)
  const dark = useThemeStore((s) => s.dark);
  const toggle = useThemeStore((s) => s.toggle);

  // Hardcoded logged-in mock user
  const hardcodedUser = {
    id: 1,
    name: "Leanne Graham",
    email: "Sincere@april.biz",
    phone: "1-770-736-8031 x56442",
    company: { name: "Romaguera-Crona" }
  };

  // Set user once
  React.useEffect(() => {
    if (!currentUser) {
      setCurrentUser(hardcodedUser);
    }
  }, [currentUser, setCurrentUser]);

  // Apply theme once on change
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">

        {/* Title */}
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          User Manager
        </h1>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Dark Mode</span>

            <Switch.Root
              checked={dark}
              onCheckedChange={toggle}
              className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative 
              data-[state=checked]:bg-blue-600 transition-colors"
            >
              <Switch.Thumb
                className="block w-4 h-4 bg-white rounded-full transition-transform duration-150 translate-x-0.5 data-[state=checked]:translate-x-6"
              />
            </Switch.Root>
          </div>

          {/* User Info */}
          {currentUser && (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-600">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-medium">
                {getInitials(currentUser.name)}
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Logged In
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
