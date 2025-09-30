import { useLocalStorage } from './useLocalStorage.js';

export const usePriceComparator = () => {
  const [products, setProducts, removeProducts] = useLocalStorage('price-comparator', []);

  // Função para adicionar um produto
  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      name: productData.name.trim(),
      unit: productData.unit,
      amount: parseFloat(productData.amount) || 0,
      packagePrice: parseFloat(productData.packagePrice) || 0,
      createdAt: new Date().toISOString()
    };

    // Calcula o preço por unidade
    newProduct.pricePerUnit = newProduct.amount > 0 ? newProduct.packagePrice / newProduct.amount : 0;

    setProducts(prevProducts => [...prevProducts, newProduct]);
    return newProduct;
  };

  // Função para atualizar um produto
  const updateProduct = (productId, updates) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.id === productId) {
          const updatedProduct = { ...product, ...updates };
          // Recalcula o preço por unidade
          updatedProduct.pricePerUnit = updatedProduct.amount > 0 
            ? updatedProduct.packagePrice / updatedProduct.amount 
            : 0;
          return updatedProduct;
        }
        return product;
      })
    );
  };

  // Função para remover um produto
  const removeProduct = (productId) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
  };

  // Função para obter produtos agrupados por unidade
  const getProductsByUnit = () => {
    const grouped = {};
    products.forEach(product => {
      if (!grouped[product.unit]) {
        grouped[product.unit] = [];
      }
      grouped[product.unit].push(product);
    });

    // Ordena cada grupo por preço por unidade (menor primeiro)
    Object.keys(grouped).forEach(unit => {
      grouped[unit].sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    });

    return grouped;
  };

  // Função para obter o melhor produto por unidade
  const getBestProductByUnit = (unit) => {
    const unitProducts = products.filter(product => product.unit === unit);
    if (unitProducts.length === 0) return null;

    return unitProducts.reduce((best, current) => 
      current.pricePerUnit < best.pricePerUnit ? current : best
    );
  };

  // Função para verificar se um produto é o melhor da sua categoria
  const isBestProduct = (product) => {
    const bestInCategory = getBestProductByUnit(product.unit);
    return bestInCategory && bestInCategory.id === product.id;
  };

  // Função para obter estatísticas
  const getStats = () => {
    const totalProducts = products.length;
    const units = [...new Set(products.map(product => product.unit))];
    const totalUnits = units.length;
    
    // Calcula a economia potencial comparando com o produto mais caro de cada categoria
    let potentialSavings = 0;
    units.forEach(unit => {
      const unitProducts = products.filter(product => product.unit === unit);
      if (unitProducts.length > 1) {
        const cheapest = unitProducts.reduce((min, current) => 
          current.pricePerUnit < min.pricePerUnit ? current : min
        );
        const mostExpensive = unitProducts.reduce((max, current) => 
          current.pricePerUnit > max.pricePerUnit ? current : max
        );
        potentialSavings += mostExpensive.pricePerUnit - cheapest.pricePerUnit;
      }
    });

    return { totalProducts, totalUnits, potentialSavings };
  };

  // Função para limpar apenas os preços
  const clearPrices = () => {
    setProducts(prevProducts =>
      prevProducts.map(product => ({
        ...product,
        packagePrice: 0,
        pricePerUnit: 0
      }))
    );
  };

  // Função para formatar o preço por unidade
  const formatPricePerUnit = (product) => {
    const price = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(product.pricePerUnit);

    const unitLabels = {
      kg: 'kg',
      g: 'g',
      l: 'L',
      ml: 'mL',
      un: 'un'
    };

    return `${price}/${unitLabels[product.unit] || product.unit}`;
  };

  return {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    getProductsByUnit,
    getBestProductByUnit,
    isBestProduct,
    getStats,
    clearPrices,
    clearAllProducts: removeProducts,
    formatPricePerUnit
  };
};
