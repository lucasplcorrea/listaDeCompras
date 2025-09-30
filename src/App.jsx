import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { ShoppingCart, BarChart2, Settings, Menu, X, Sun, Moon } from 'lucide-react'
// Importação do CSS já está no index.css com Tailwind

// Importar componentes
import ShoppingListsManager from './components/ShoppingLists/ShoppingListsManager'
import ShoppingListDetail from './components/ShoppingList/ShoppingListDetail'
import PriceComparison from './components/PriceComparison/PriceComparison'
import Admin from './components/Admin/Admin'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('/')
  const [selectedListId, setSelectedListId] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  // Carregar preferência de tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(savedTheme === 'true');
    } else {
      // Verificar preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Aplicar tema quando darkMode mudar
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  }
  
  // Define os títulos das páginas
  const getPageTitle = () => {
    if (selectedListId) return 'Detalhes da Lista';
    
    switch(activeTab) {
      case '/': return 'Minhas Listas';
      case '/comparativo': return 'Comparador de Preços';
      case '/admin': return 'Administração';
      default: return 'Lista Smart';
    }
  }

  const handleSelectList = (listId) => {
    setSelectedListId(listId);
  }

  const handleBackToLists = () => {
    setSelectedListId(null);
  }

  return (
    <Router>
      <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 dark:text-white ${darkMode ? 'dark' : ''}`}>
        {/* Barra lateral */}
        <div className={`${menuOpen ? 'w-64' : 'w-0'} bg-gray-800 dark:bg-gray-900 text-white transition-all duration-300 overflow-hidden fixed h-full z-20 md:relative md:w-64 shadow-lg`}>
          <div className="p-4">
            <div className="flex items-center mb-6">
              <ShoppingCart className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-bold ml-2">Lista Smart</h2>
            </div>
            <nav className="flex flex-col space-y-1">
              <Link 
                to="/" 
                className={`p-3 flex items-center rounded-lg transition-colors ${activeTab === '/' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`} 
                onClick={() => {
                  setMenuOpen(false);
                  setActiveTab('/');
                  setSelectedListId(null); // Voltar para a lista de listas
                }}
              >
                <ShoppingCart className="h-5 w-5 mr-3" />
                <span>Minhas Listas</span>
              </Link>
              <Link 
                to="/comparativo" 
                className={`p-3 flex items-center rounded-lg transition-colors ${activeTab === '/comparativo' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`} 
                onClick={() => {
                  setMenuOpen(false);
                  setActiveTab('/comparativo');
                }}
              >
                <BarChart2 className="h-5 w-5 mr-3" />
                <span>Comparador</span>
              </Link>
              <Link 
                to="/admin" 
                className={`p-3 flex items-center rounded-lg transition-colors ${activeTab === '/admin' ? 'bg-red-600 text-white' : 'hover:bg-gray-700'}`} 
                onClick={() => {
                  setMenuOpen(false);
                  setActiveTab('/admin');
                }}
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>Administração</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Cabeçalho */}
          <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <button 
                  onClick={toggleMenu}
                  className="text-gray-700 dark:text-gray-300 focus:outline-none hover:text-red-600 dark:hover:text-red-400 md:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white ml-2">{getPageTitle()}</h1>
              </div>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-colors"
                onClick={toggleTheme}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </header>

          {/* Conteúdo da página */}
          <main className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
            <Routes>
              <Route path="/" element={
                selectedListId ? (
                  <ShoppingListDetail 
                    listId={selectedListId} 
                    onBack={handleBackToLists} 
                  />
                ) : (
                  <ShoppingListsManager onSelectList={handleSelectList} />
                )
              } />
              <Route path="/comparativo" element={<PriceComparison />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>

          {/* Barra de navegação inferior para mobile */}
          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden fixed bottom-0 left-0 right-0 z-10">
            <div className="flex justify-around items-center h-16">
              <Link 
                to="/" 
                className={`flex flex-col items-center justify-center w-full h-full ${activeTab === '/' ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => {
                  setActiveTab('/');
                  setSelectedListId(null);
                }}
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="text-xs mt-1">Listas</span>
              </Link>
              <Link 
                to="/comparativo" 
                className={`flex flex-col items-center justify-center w-full h-full ${activeTab === '/comparativo' ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setActiveTab('/comparativo')}
              >
                <BarChart2 className="h-6 w-6" />
                <span className="text-xs mt-1">Comparar</span>
              </Link>
              <Link 
                to="/admin" 
                className={`flex flex-col items-center justify-center w-full h-full ${activeTab === '/admin' ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
                onClick={() => setActiveTab('/admin')}
              >
                <Settings className="h-6 w-6" />
                <span className="text-xs mt-1">Admin</span>
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  )
}

export default App
