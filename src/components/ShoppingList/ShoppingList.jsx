import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, ShoppingBag, DollarSign, Package, Tag } from 'lucide-react';
import { CATEGORIES, getCategoryForItem, getCategoryStyle } from '../../data/categories';

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, price: '', category: '' });
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const savedItems = localStorage.getItem('shoppingItems');
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      
      // Garantir que todos os itens tenham uma categoria
      const itemsWithCategories = parsedItems.map(item => {
        if (!item.category) {
          return {
            ...item,
            category: getCategoryForItem(item.name)
          };
        }
        return item;
      });
      
      setItems(itemsWithCategories);
    }
  }, []);

  // Salvar dados no localStorage quando items mudar
  useEffect(() => {
    localStorage.setItem('shoppingItems', JSON.stringify(items));
    
    // Calcular totais
    const price = items.reduce((total, item) => {
      return total + (parseFloat(item.price) * parseFloat(item.quantity) || 0);
    }, 0);
    
    const itemCount = items.reduce((total, item) => {
      return total + (parseInt(item.quantity) || 0);
    }, 0);
    
    setTotalPrice(price);
    setTotalItems(itemCount);
  }, [items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value
    });
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    // Usar a categoria selecionada ou detectar automaticamente
    const category = newItem.category || getCategoryForItem(newItem.name.trim());
    const itemToAdd = {
      id: Date.now(),
      name: newItem.name.trim(),
      quantity: newItem.quantity || 1,
      price: newItem.price || 0,
      category: category
    };

    setItems([...items, itemToAdd]);
    setNewItem({ name: '', quantity: 1, price: '', category: '' });
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Se o nome do item foi alterado, atualizar a categoria
        if (field === 'name') {
          updatedItem.category = getCategoryForItem(value);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Compras</h1>
      
      {/* Formulário para adicionar item */}
      <form onSubmit={addItem} className="mb-6 bg-white p-4 rounded-lg shadow card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Item</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newItem.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nome do item"
              required
            />
          </div>
          
          <div className="mb-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select
              id="category"
              name="category"
              value={newItem.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              value={newItem.quantity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={newItem.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className="mt-3 w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 btn"
        >
          <Plus className="h-4 w-4 mr-2 inline" />
          Adicionar Item
        </button>
      </form>
      
      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 bg-blue-50 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total de Itens</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="card p-4 bg-green-50 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Valor Total</p>
              <p className="text-2xl font-bold">R$ {totalPrice.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="card p-4 bg-purple-50 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Média por Item</p>
              <p className="text-2xl font-bold">R$ {totalItems > 0 ? (totalPrice / totalItems).toFixed(2) : '0.00'}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
      
      {/* Lista de itens */}
      <div className="bg-white rounded-lg shadow overflow-hidden card mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2 text-blue-500" />
            Itens da Lista
          </h2>
        </div>
        
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Nenhum item na lista. Adicione itens usando o formulário acima.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Agrupar itens por categoria */}
            {Object.entries(CATEGORIES).map(([categoryName, categoryData]) => {
              // Filtrar itens desta categoria
              const categoryItems = items.filter(item => 
                item.category === categoryName || 
                (!item.category && getCategoryForItem(item.name) === categoryName)
              );
              
              // Não mostrar categorias vazias
              if (categoryItems.length === 0) return null;
              
              return (
                <div key={categoryName} className="mb-4">
                  <div className={`px-4 py-2 flex items-center ${categoryData.color}`}>
                    <span className="mr-2">{categoryData.icon}</span>
                    <h3 className="font-medium">{categoryName}</h3>
                    <span className="ml-2 text-sm">{categoryItems.length} {categoryItems.length === 1 ? 'item' : 'itens'}</span>
                  </div>
                  
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço (R$)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categoryItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 border-b border-transparent focus:border-gray-300 focus:outline-none"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                              className="w-20 px-2 py-1 border-b border-transparent focus:border-gray-300 focus:outline-none"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                              className="w-24 px-2 py-1 border-b border-transparent focus:border-gray-300 focus:outline-none"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            R$ {(parseFloat(item.price) * parseFloat(item.quantity) || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="text-red-600 hover:text-red-900 focus:outline-none flex items-center"
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

export default ShoppingList;