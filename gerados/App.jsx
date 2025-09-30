import { useState } from 'react';
import { Menu, X, ShoppingCart, Calculator, Settings, List } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import ListManager from './components/ListManager.jsx';
import ShoppingList from './components/ShoppingList.jsx';
import PriceComparator from './components/PriceComparator.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('lists');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentListId, setCurrentListId] = useState(null);

  const tabs = [
    { id: 'lists', name: 'Minhas Listas', icon: List },
    { id: 'shopping', name: 'Lista Ativa', icon: ShoppingCart },
    { id: 'comparator', name: 'Comparador', icon: Calculator },
    { id: 'admin', name: 'Administração', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'lists':
        return <ListManager onSelectList={setCurrentListId} onCreateList={() => setActiveTab('shopping')} />;
      case 'shopping':
        return <ShoppingList currentListId={currentListId} />;
      case 'comparator':
        return <PriceComparator />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <ListManager onSelectList={setCurrentListId} onCreateList={() => setActiveTab('shopping')} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 bg-card overflow-y-auto border-r border-border">
          <div className="flex items-center flex-shrink-0 px-4">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-xl font-bold text-foreground">Lista Smart</h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full justify-start"
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {tab.name}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar mobile */}
      <div className={`md:hidden fixed inset-0 z-40 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <h1 className="ml-2 text-xl font-bold text-foreground">Lista Smart</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    {tab.name}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header mobile */}
        <div className="md:hidden">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-card shadow border-b border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="px-4 border-r border-border md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex-1 px-4 flex justify-between items-center">
              <h1 className="text-lg font-medium text-foreground">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Área de conteúdo */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {renderContent()}
            </div>
          </div>
        </main>

        {/* Barra de navegação inferior para mobile */}
        <div className="md:hidden bg-card border-t border-border">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const shortName = tab.name.split(' ')[0];
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center py-2 px-1 text-xs font-medium h-auto rounded-none ${
                    activeTab === tab.id
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="truncate">{shortName}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default App;
