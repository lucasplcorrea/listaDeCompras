import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, ShoppingBag, DollarSign, Package, Tag, ArrowLeft } from 'lucide-react';
import { CATEGORIES, getCategoryForItem, getCategoryStyle } from '../../data/categories';
import { getShoppingListById, saveShoppingList } from '../../data/shoppingLists';

const ShoppingListDetail = ({ listId, onBack }) => {
  const [list, setList] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, price: '', category: '' });
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Carregar dados da lista específica
  useEffect(() => {
    if (listId) {
      const shoppingList = getShoppingListById(listId);
      if (shoppingList) {
        // Garantir que todos os itens tenham uma categoria
        const itemsWithCategories = shoppingList.items.map(item => {
          if (!item.category) {
            return {
              ...item,
              category: getCategoryForItem(item.name)
            };
          }
          return item;
        });
        
        setList({
          ...shoppingList,
          items: itemsWithCategories
        });
      }
    }
    setLoading(false);
  }, [listId]);

  // Calcular totais quando a lista mudar
  useEffect(() => {
    if (list) {
      // Calcular totais
      const price = list.items.reduce((total, item) => {
        return total + (parseFloat(item.price) * parseFloat(item.quantity) || 0);
      }, 0);
      
      const itemCount = list.items.reduce((total, item) => {
        return total + (parseInt(item.quantity) || 0);
      }, 0);
      
      setTotalPrice(price);
      setTotalItems(itemCount);
    }
  }, [list]);

  // Salvar a lista quando houver alterações
  const saveList = (updatedList) => {
    const listToSave = {
      ...updatedList,
      updatedAt: new Date().toISOString()
    };
    saveShoppingList(listToSave);
    setList(listToSave);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value
    });
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !list) return;

    // Usar a categoria selecionada ou detectar automaticamente
    const category = newItem.category || getCategoryForItem(newItem.name.trim());
    const itemToAdd = {
      id: Date.now().toString(),
      name: newItem.name.trim(),
      quantity: newItem.quantity || 1,
      price: newItem.price || 0,
      category: category
    };

    const updatedList = {
      ...list,
      items: [...list.items, itemToAdd]
    };
    
    saveList(updatedList);
    setNewItem({ name: '', quantity: 1, price: '', category: '' });
  };

  const updateItem = (id, field, value) => {
    if (!list) return;
    
    const updatedItems = list.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Se o nome do item foi alterado, atualizar a categoria
        if (field === 'name') {
          updatedItem.category = getCategoryForItem(value);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    saveList({
      ...list,
      items: updatedItems
    });
  };

  const deleteItem = (id) => {
    if (!list) return;
    
    const updatedItems = list.items.filter(item => item.id !== id);
    
    saveList({
      ...list,
      items: updatedItems
    });
  };

  if (loading) {
    return <div className="p-4 text-center">Carregando...</div>;
  }

  if (!list) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">Lista não encontrada</p>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2 inline" />
          Voltar para Minhas Listas
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      <div className="flex items-center mb-4">
        <button 
          onClick={onBack}
          className="mr-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-5 w-5 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold dark:text-white">{list.name}</h1>
      </div>
      
      {/* Formulário para adicionar item */}
      <form onSubmit={addItem} className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nome do item"
              required
            />
          </div>
          
          <div className="mb-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria</label>
            <select
              id="category"
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Detectar automaticamente</option>
              {Object.entries(CATEGORIES).map(([categoryName, categoryData]) => (
                <option key={categoryName} value={categoryName}>
                  {categoryData.icon} {categoryName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-2">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantidade</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={newItem.quantity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="mb-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço (R$)</label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={newItem.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="mt-3 w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 btn flex items-center justify-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Item
        </button>
      </form>
      
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total de Itens</p>
              <p className="text-2xl font-bold dark:text-white">{totalItems}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="card p-4 bg-green-50 dark:bg-gray-800 border border-green-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Valor Total</p>
              <p className="text-2xl font-bold dark:text-white">R$ {totalPrice.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500 dark:text-green-400" />
          </div>
        </div>
        
        <div className="card p-4 bg-purple-50 dark:bg-gray-800 border border-purple-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Média por Item</p>
              <p className="text-2xl font-bold dark:text-white">R$ {totalItems > 0 ? (totalPrice / totalItems).toFixed(2) : '0.00'}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-purple-500 dark:text-purple-400" />
          </div>
        </div>
      </div>
      
      {/* Lista de itens */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden card mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center dark:text-white">
            <ShoppingBag className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
            Itens da Lista
          </h2>
        </div>
        
        {list.items.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Nenhum item na lista. Adicione itens usando o formulário acima.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Agrupar itens por categoria */}
            {Object.entries(CATEGORIES).map(([categoryName, categoryData]) => {
              // Filtrar itens desta categoria
              const categoryItems = list.items.filter(item => 
                item.category === categoryName || 
                (!item.category && getCategoryForItem(item.name) === categoryName)
              );
              
              // Não mostrar categorias vazias
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={categoryName} className="mb-4">
                  <div className={`px-4 py-2 flex items-center ${categoryData.color}`}>
                    <span className="mr-2">{categoryData.icon}</span>
                    <h3 className="font-medium dark:text-white">{categoryName}</h3>
                    <span className="ml-2 text-sm dark:text-gray-300">{categoryItems.length} {categoryItems.length === 1 ? 'item' : 'itens'}</span>
                  </div>
                  
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantidade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Preço (R$)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subtotal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {categoryItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 border-b border-transparent focus:border-gray-300 dark:focus:border-gray-600 focus:outline-none dark:text-white dark:bg-gray-800"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                              className="w-20 px-2 py-1 border-b border-transparent focus:border-gray-300 dark:focus:border-gray-600 focus:outline-none dark:text-white dark:bg-gray-800"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                              className="w-24 px-2 py-1 border-b border-transparent focus:border-gray-300 dark:focus:border-gray-600 focus:outline-none dark:text-white dark:bg-gray-800"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            R$ {(parseFloat(item.price) * parseFloat(item.quantity) || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-400 focus:outline-none flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingListDetail;