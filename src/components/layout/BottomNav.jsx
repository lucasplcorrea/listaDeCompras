import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Calculator, 
  Settings, 
  FolderOpen 
} from 'lucide-react';

const navItems = [
  {
    path: '/',
    icon: ShoppingCart,
    label: 'Lista'
  },
  {
    path: '/comparador',
    icon: Calculator,
    label: 'Comparar'
  },
  {
    path: '/listas',
    icon: FolderOpen,
    label: 'Listas'
  },
  {
    path: '/admin',
    icon: Settings,
    label: 'Config'
  }
];

export function BottomNav() {
  const location = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-0 flex-1
                ${isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
