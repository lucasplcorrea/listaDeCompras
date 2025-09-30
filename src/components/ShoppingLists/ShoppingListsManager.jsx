import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Copy, ShoppingBag, Calendar, Clock, Check, X } from 'lucide-react';
import { 
  getShoppingLists, 
  createShoppingList, 
  deleteShoppingList, 
  saveShoppingList,
  importShoppingList
} from '../../data/shoppingLists';

const ShoppingListsManager = ({ onSelectList }) => {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedListToImport, setSelectedListToImport] = useState('');
  const [importName, setImportName] = useState('');

  // Carregar listas ao iniciar
  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = () => {
    const savedLists = getShoppingLists();
    setLists(savedLists);
  };

  const handleCreateList = (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    
    createShoppingList(newListName.trim());
    setNewListName('');
    loadLists();
  };

  const handleDeleteList = (listId) => {
    if (window.confirm('Tem certeza que deseja excluir esta lista?')) {
      deleteShoppingList(listId);
      loadLists();
    }
  };

  const startEditingList = (list) => {
    setEditingListId(list.id);
    setEditingName(list.name);
  };

  const saveEditingList = (listId) => {
    if (!editingName.trim()) return;
    
    const listToUpdate = lists.find(list => list.id === listId);
    if (listToUpdate) {
      const updatedList = {
        ...listToUpdate,
        name: editingName.trim(),
        updatedAt: new Date().toISOString()
      };
      
      saveShoppingList(updatedList);
      setEditingListId(null);
      loadLists();
    }
  };

  const cancelEditing = () => {
    setEditingListId(null);
  };

  const handleImportList = () => {
    if (!selectedListToImport) return;
    
    importShoppingList(selectedListToImport, importName.trim() || undefined);
    setShowImportModal(false);
    setSelectedListToImport('');
    setImportName('');
    loadLists();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <div className="p-4 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Minhas Listas de Compras</h1>
      
      {/* Formulário para criar nova lista */}
      <form onSubmit={handleCreateList} className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow card">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-grow">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nome da nova lista"
              required
            />
          </div>
          <button 
            type="submit" 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 btn flex items-center justify-center dark:bg-red-700 dark:hover:bg-red-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Lista
          </button>
        </div>
      </form>
      
      {/* Botão para importar lista */}
      <div className="mb-6">
        <button 
          onClick={() => setShowImportModal(true)} 
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 btn flex items-center dark:bg-red-700 dark:hover:bg-red-800"
          disabled={lists.length === 0}
        >
          <Copy className="h-4 w-4 mr-2" />
          Importar Lista Existente
        </button>
      </div>
      
      {/* Lista de listas de compras */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden card">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center dark:text-white">
            <ShoppingBag className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
            Listas Disponíveis
          </h2>
        </div>
        
        {lists.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Nenhuma lista criada. Crie uma nova lista usando o formulário acima.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {lists.map((list) => (
              <div key={list.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow dark:border-gray-700">
                <div className="p-4 border-b dark:border-gray-700">
                  {editingListId === list.id ? (
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-grow px-2 py-1 border rounded mr-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoFocus
                      />
                      <button 
                        onClick={() => saveEditingList(list.id)}
                        className="p-1 text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={cancelEditing}
                        className="p-1 text-red-600 hover:text-red-800 ml-1 dark:text-red-500 dark:hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="font-medium text-lg dark:text-white">{list.name}</h3>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Criada em: {formatDate(list.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-3 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Atualizada em: {formatDate(list.updatedAt)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    <span>{list.items.length} {list.items.length === 1 ? 'item' : 'itens'}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between">
                  <button 
                    onClick={() => onSelectList(list.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    Abrir
                  </button>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => startEditingList(list)}
                      className="p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteList(list.id)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal de importação */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Importar Lista Existente</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selecione a lista para importar</label>
              <select
                value={selectedListToImport}
                onChange={(e) => setSelectedListToImport(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Selecione uma lista</option>
                {lists.map(list => (
                  <option key={list.id} value={list.id}>{list.name}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome da nova lista (opcional)</label>
              <input
                type="text"
                value={importName}
                onChange={(e) => setImportName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Deixe em branco para usar 'Cópia de [nome original]'"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportList}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800"
                disabled={!selectedListToImport}
              >
                Importar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListsManager;