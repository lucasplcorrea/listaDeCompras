import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Edit2, Check, DollarSign, Package, Plus, BarChart2 } from 'lucide-react';

const PriceComparison = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    unit: 'g', // g, kg, ml, l, unidade
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editProduct, setEditProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    unit: 'g'
  });

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('comparisonProducts');
      console.log('Produtos carregados do localStorage:', savedProducts);
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        console.log('Produtos parseados:', parsedProducts);
        setProducts(parsedProducts);
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Erro ao carregar produtos do localStorage:', error);
      setIsLoaded(true);
    }
  }, []);

  // Salvar dados no localStorage quando products mudar
  useEffect(() => {
    if (isLoaded) { // Só salva depois que os dados foram carregados
      try {
        console.log('Salvando produtos no localStorage:', products);
        localStorage.setItem('comparisonProducts', JSON.stringify(products));
        console.log('Produtos salvos com sucesso!');
      } catch (error) {
        console.error('Erro ao salvar produtos no localStorage:', error);
      }
    }
  }, [products, isLoaded]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const addProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.quantity) return;

    const productToAdd = {
      id: Date.now(),
      name: newProduct.name.trim(),
      price: parseFloat(newProduct.price),
      quantity: parseFloat(newProduct.quantity),
      unit: newProduct.unit,
      unitPrice: calculateUnitPrice(newProduct)
    };

    setProducts([...products, productToAdd]);
    setNewProduct({ name: '', price: '', quantity: '', unit: 'g' });
  };

  const calculateUnitPrice = (product) => {
    const price = parseFloat(product.price);
    const quantity = parseFloat(product.quantity);
    
    if (!price || !quantity) return 0;
    
    // Converter para a unidade base (g ou ml)
    let baseQuantity = quantity;
    if (product.unit === 'kg') baseQuantity = quantity * 1000;
    if (product.unit === 'l') baseQuantity = quantity * 1000;
    
    // Calcular preço por 100g/100ml ou por unidade
    if (product.unit === 'unidade') {
      return price / quantity;
    } else {
      return (price / baseQuantity) * 100; // Preço por 100g ou 100ml
    }
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditProduct({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      unit: product.unit
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: value
    });
  };

  const saveEdit = (id) => {
    const updatedProducts = products.map(product => {
      if (product.id === id) {
        const updatedProduct = {
          ...product,
          name: editProduct.name.trim(),
          price: parseFloat(editProduct.price),
          quantity: parseFloat(editProduct.quantity),
          unit: editProduct.unit
        };
        updatedProduct.unitPrice = calculateUnitPrice(updatedProduct);
        return updatedProduct;
      }
      return product;
    });
    
    setProducts(updatedProducts);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const getUnitPriceLabel = (product) => {
    if (product.unit === 'unidade') {
      return 'R$ por unidade';
    } else if (product.unit === 'g' || product.unit === 'kg') {
      return 'R$ por 100g';
    } else {
      return 'R$ por 100ml';
    }
  };

  // Ordenar produtos pelo melhor preço unitário
  const sortedProducts = [...products].sort((a, b) => a.unitPrice - b.unitPrice);

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        <BarChart2 className="mr-2 h-6 w-6 text-red-500 dark:text-red-400" />
        Comparador de Preços</h1>
      
      {/* Formulário para adicionar produto */}
      <form onSubmit={addProduct} className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Produto</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nome do produto"
              required
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
              value={newProduct.price}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="0.00"
              required
            />
          </div>
          
          <div className="mb-2">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantidade</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              step="0.01"
              value={newProduct.quantity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              placeholder="Quantidade"
              required
            />
          </div>
          
          <div className="mb-2">
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unidade</label>
            <select
              id="unit"
              name="unit"
              value={newProduct.unit}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="g">Gramas (g)</option>
              <option value="kg">Quilogramas (kg)</option>
              <option value="ml">Mililitros (ml)</option>
              <option value="l">Litros (l)</option>
              <option value="unidade">Unidade</option>
            </select>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="mt-3 w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 btn flex items-center justify-center"
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar Produto
        </button>
      </form>
      
      {/* Melhor opção */}
      {products.length > 1 && (
        <div className="card p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-green-800 dark:text-green-400 mb-1">Melhor Opção</h2>
              <p className="text-xl font-bold dark:text-white">{sortedProducts[0].name}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                R$ {sortedProducts[0].unitPrice.toFixed(2)} {getUnitPriceLabel(sortedProducts[0])}
              </p>
            </div>
            <BarChart2 className="h-10 w-10 text-green-500 dark:text-green-400" />
          </div>
        </div>
      )}
      
      {/* Lista de produtos para comparação */}
      <div className="card mb-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center dark:text-white">
            <ShoppingCart className="h-5 w-5 mr-2 text-red-500 dark:text-red-400" />
            Produtos para Comparação
          </h2>
        </div>
        
        {products.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">Nenhum produto para comparar. Adicione produtos acima.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedProducts.map((product, index) => (
              <div key={product.id} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${index === 0 ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                {editingId === product.id ? (
                  <div className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <input
                        type="text"
                        name="name"
                        value={editProduct.name}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 dark:text-gray-400 sm:text-sm">R$</span>
                        </div>
                        <input
                          type="number"
                          name="price"
                          step="0.01"
                          min="0"
                          value={editProduct.price}
                          onChange={handleEditChange}
                          className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={editProduct.quantity}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                      <select
                        name="unit"
                        value={editProduct.unit}
                        onChange={handleEditChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      >
                        <option value="g">Gramas (g)</option>
                        <option value="kg">Quilogramas (kg)</option>
                        <option value="ml">Mililitros (ml)</option>
                        <option value="l">Litros (l)</option>
                        <option value="unidade">Unidade</option>
                      </select>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveEdit(product.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 flex items-center"
                      >
                        <Check className="h-4 w-4 mr-1" /> Salvar
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{product.name}</h3>
                      <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="mr-3">R$ {product.price.toFixed(2)}</span>
                        <span className="mr-3">•</span>
                        <span className="mr-3">{product.quantity} {product.unit}</span>
                        <span className="mr-3">•</span>
                        <span className="font-medium text-red-600 dark:text-red-400">R$ {product.unitPrice.toFixed(2)} {getUnitPriceLabel(product)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 md:mt-0 flex items-center">
                      {index === 0 && (
                        <span className="mr-3 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full font-medium">
                          Melhor opção
                        </span>
                      )}
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => startEdit(product)}
                          className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Explicação */}
      {products.length > 0 && (
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
            Como funciona a comparação?
          </h2>
          <p className="text-sm text-gray-600">
            Os produtos são ordenados pelo menor preço por unidade de medida. Para produtos em gramas ou mililitros, 
            calculamos o preço por 100g ou 100ml para facilitar a comparação. Para produtos vendidos por unidade, 
            calculamos o preço por unidade. A melhor opção (mais econômica) aparece destacada em verde.
          </p>
        </div>
      )}
    </div>
  );
};

export default PriceComparison;