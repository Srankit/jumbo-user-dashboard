"use client";

import React from "react";
import { useUsersStore } from "./store/UserStore";

export default function ActivityLog() {
  const logs = useUsersStore((s) => s.activityLog);
  const clearLogs = useUsersStore((s) => s.clearActivityLog);

  const getColor = (msg: string) => {
    if (msg.includes("Added")) return "text-emerald-600";
    if (msg.includes("Updated")) return "text-blue-600";
    if (msg.includes("Deleted")) return "text-red-600";
    return "text-violet-600";
  };

  const getIcon = (msg: string) => {
    if (msg.includes("Added")) return "➕";
    if (msg.includes("Updated")) return "✏️";
    if (msg.includes("Deleted")) return "🗑️";
    return "📝";
  };

  return (
    <aside
      className="
        w-72 h-screen flex flex-col 
        border-l border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900 w-[352px]

      "
    >
      {/* HEADER */}
      <div className="px-5 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700 ">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Activity Log
        </h2>

        <p className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">
          Recently updated items
        </p>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-300">Total Logs</span>
          <span
            className="
              px-3 py-1 rounded-full text-xs
              bg-gray-100 dark:bg-gray-800
              text-gray-700 dark:text-gray-300
            "
          >
            {logs.length}
          </span>
        </div>
      </div>

      {/* LOG LIST */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {logs.length === 0 && (
          <div className="pt-20 text-center opacity-70">
            <div
              className="
                mx-auto w-14 h-14 rounded-xl 
                bg-gray-200 dark:bg-gray-700 
                flex items-center justify-center
              "
            >
              <span className="text-gray-500 dark:text-gray-400 text-2xl">
                📝
              </span>
            </div>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">
              No activity yet
            </p>
          </div>
        )}

        {logs.map((log, i) => {
          const [time, msg] = log.split("—");

          return (
            <div
              key={i}
              className="
                p-3 rounded-xl border
                bg-gray-50 dark:bg-gray-800/40
                border-gray-200 dark:border-gray-700
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-colors
              "
            >
              <div className="flex items-start gap-3">
                {/* ICON */}
                <span className={`text-lg ${getColor(msg)}`}>
                  {getIcon(msg)}
                </span>

                {/* TEXT */}
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {msg}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {time}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      {logs.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={clearLogs}
            className="
              w-full py-2 rounded-md text-sm font-medium text-white
              bg-red-600 hover:bg-red-700
              transition-colors
            "
          >
            Clear All Logs
          </button>
        </div>
      )}
    </aside>
  );
}
