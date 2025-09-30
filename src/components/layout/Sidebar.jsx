import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
  ShoppingCart,
  Calculator,
  Settings,
  FolderOpen,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    path: '/',
    icon: ShoppingCart,
    label: 'Lista de Compras',
    description: 'Gerencie seus itens'
  },
  {
    path: '/comparador',
    icon: Calculator,
    label: 'Comparador',
    description: 'Compare preços por unidade'
  },
  {
    path: '/listas',
    icon: FolderOpen,
    label: 'Minhas Listas',
    description: 'Gerencie suas listas'
  },
  {
    path: '/admin',
    icon: Settings,
    label: 'Configurações',
    description: 'Limpar dados'
  }
];

export function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-sidebar border-r border-sidebar-border z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">
              Lista de Compras
            </h1>
            <p className="text-sm text-sidebar-foreground/70">
              Organize suas compras
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onToggle}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {item.label}
                  </div>
                  <div className="text-xs opacity-70 truncate">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border flex items-center justify-between">
          <div className="text-xs text-sidebar-foreground/50">
            Desenvolvido com React & Tailwind
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </>
  );
}

export function SidebarToggle({ onToggle }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="lg:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
