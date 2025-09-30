import { useState } from 'react';
import { Trash2, RefreshCw, AlertTriangle, CheckCircle, Settings, Database } from 'lucide-react';

const Admin = () => {
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [confirmClearPrices, setConfirmClearPrices] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleClearAll = () => {
    if (!confirmClearAll) {
      setConfirmClearAll(true);
      setConfirmClearPrices(false);
      return;
    }

    // Limpar todos os dados do localStorage
    localStorage.removeItem('shoppingItems');
    localStorage.removeItem('comparisonProducts');
    
    setMessage({ 
      text: 'Todos os dados foram removidos com sucesso!', 
      type: 'success' 
    });
    
    setConfirmClearAll(false);
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const handleClearPrices = () => {
    if (!confirmClearPrices) {
      setConfirmClearPrices(true);
      setConfirmClearAll(false);
      return;
    }

    // Obter itens da lista de compras
    const shoppingItems = JSON.parse(localStorage.getItem('shoppingItems') || '[]');
    
    // Limpar preços e quantidades
    const updatedItems = shoppingItems.map(item => ({
      ...item,
      price: 0,
      quantity: 1
    }));
    
    // Salvar de volta no localStorage
    localStorage.setItem('shoppingItems', JSON.stringify(updatedItems));
    
    setMessage({ 
      text: 'Preços e quantidades foram resetados com sucesso!', 
      type: 'success' 
    });
    
    setConfirmClearPrices(false);
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  const cancelAction = () => {
    setConfirmClearAll(false);
    setConfirmClearPrices(false);
  };

  return (
    <div className="p-4 pb-20 md:pb-4 animate-fade-in dark:bg-gray-900 dark:text-white">
      <h1 className="text-xl font-bold mb-6 flex items-center">
        <Settings className="h-6 w-6 mr-2 text-gray-700 dark:text-gray-300" />
        Painel Administrativo
      </h1>
      
      {/* Mensagem de feedback */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-md flex items-start ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
          {message.type === 'success' ? 
            <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" /> : 
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          }
          <span>{message.text}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card para limpar preços e quantidades */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 text-amber-500" />
              Limpar Preços e Quantidades
            </h2>
          </div>
          <div className="p-4">
            <p className="text-gray-600 mb-4">
              Esta ação irá resetar todos os preços para zero e todas as quantidades para 1, 
              mantendo os nomes dos itens na sua lista de compras.
            </p>
          
          {confirmClearPrices ? (
            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-md animate-fade-in">
              <p className="text-amber-600 dark:text-amber-400 font-medium mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Tem certeza que deseja limpar os preços e quantidades?
              </p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleClearPrices}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 btn flex items-center justify-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sim, limpar
                </button>
                <button
                  onClick={cancelAction}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-600 btn flex items-center justify-center"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleClearPrices}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 btn flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar Preços e Quantidades
            </button>
          )}
          </div>
        </div>
        
        {/* Card para limpar todos os dados */}
        <div className="card overflow-hidden dark:bg-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <h2 className="text-lg font-semibold flex items-center text-gray-800 dark:text-white">
              <Database className="h-5 w-5 mr-2 text-red-500 dark:text-red-400" />
              Limpar Todos os Dados
            </h2>
          </div>
          <div className="p-4">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Esta ação irá remover todos os dados salvos, incluindo itens da lista de compras 
              e produtos do comparativo de preços. Esta ação não pode ser desfeita.
            </p>
            
            {confirmClearAll ? (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-md animate-fade-in">
                <p className="text-red-600 dark:text-red-400 font-medium mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Tem certeza que deseja limpar todos os dados?
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 btn flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Sim, limpar tudo
                  </button>
                  <button
                    onClick={cancelAction}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-600 btn flex items-center justify-center"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 btn flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Todos os Dados
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Informações sobre o aplicativo */}
      <div className="mt-6 card overflow-hidden dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-semibold flex items-center text-gray-800 dark:text-white">
            <Settings className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
            Sobre o Aplicativo
          </h2>
        </div>
        <div className="p-4">
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            Este aplicativo de lista de compras foi desenvolvido para ajudar você a organizar suas compras 
            e comparar preços de produtos, economizando tempo e dinheiro.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            Todos os dados são armazenados localmente no seu dispositivo através do localStorage, 
            garantindo sua privacidade.
          </p>
          <p className="text-gray-600 dark:text-gray-400 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500 dark:text-green-400" />
            Versão: 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;