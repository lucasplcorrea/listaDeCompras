import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarToggle } from './Sidebar';
import { BottomNav } from './BottomNav';
import { ThemeProvider } from 'next-themes';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fechar sidebar em telas maiores
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // Tailwind's 'lg' breakpoint
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        {/* Toggle button para mobile */}
        <SidebarToggle onToggle={toggleSidebar} />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col lg:ml-80 min-h-screen pb-16 lg:pb-0">
          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
        
        {/* Bottom navigation para mobile */}
        <BottomNav />
      </div>
    </ThemeProvider>
  );
}
