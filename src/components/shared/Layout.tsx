import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-amber-50">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-16 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
