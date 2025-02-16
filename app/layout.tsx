'use client';

// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import {
  HomeIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "NZ Verdict Vault",
//   description: "AI-powered legal research assistant",
// };

const sidebarItems = [
  { name: 'Dashboard', href: '/law', icon: HomeIcon },
  { name: 'Case Search', href: '/law/search', icon: DocumentTextIcon },
  { name: 'Embeddings', href: '/law/embed', icon: DocumentDuplicateIcon, badge: 'New' },
  { name: 'Summarize', href: '/law/summarize', icon: UserGroupIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Sign Out', href: '/auth/signout', icon: ArrowLeftOnRectangleIcon },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-900/50 z-30 sm:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Toggle Button */}
        <button
          onClick={toggleSidebar}
          type="button"
          className="fixed top-4 left-4 z-40 sm:hidden inline-flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <span className="sr-only">Toggle sidebar</span>
          {isSidebarOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 w-72 h-screen transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } sm:translate-x-0`}
          aria-label="Sidebar"
        >
          <div className="h-full px-6 py-8 overflow-y-auto bg-white shadow-xl">
            {/* Logo Section */}
            <div className="mb-8">
              <div className="relative flex items-center">
                <div className="relative mr-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full">
                    <div className="absolute top-0 left-0 w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">NZ Verdict Vault</h1>
                  <p className="text-sm text-gray-500">AI-powered legal research</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-3">
              {sidebarItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className="group flex items-center p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-blue-100 transition-all duration-300"
                >
                  <div className="relative flex items-center gap-3 flex-1">
                    <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-white group-hover:text-blue-600 transition-colors duration-300`}>
                      <item.icon
                        className="w-5 h-5 transition duration-300 group-hover:scale-110"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {item.name}
                      </p>
                      {item.badge && (
                        <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                          New feature available
                        </p>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-8 left-6 right-6">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-sm text-gray-600 mb-1 font-medium">Need Help?</p>
                <p className="text-xs text-gray-500">Check our documentation or contact support</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="p-4 sm:ml-72 transition-all duration-300">
          <div className="rounded-lg">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
