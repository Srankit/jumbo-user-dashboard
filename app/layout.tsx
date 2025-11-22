// app/layout.tsx
import React from "react";
import "./globals.css";
import Navbar from "./src/components/NavBar";
import Providers from "./src/components/Providers";

export const metadata = {
  title: "User Management Dashboard",
  description: "A modern user management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 transition-colors">
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}