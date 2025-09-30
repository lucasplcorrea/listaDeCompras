// Categorias predefinidas com seus itens comuns
export const CATEGORIES = {
  'Laticínios': {
    icon: '🥛',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    items: ['leite', 'queijo', 'iogurte', 'manteiga', 'requeijão', 'creme de leite', 'nata', 'ricota', 'mussarela', 'parmesão']
  },
  'Carnes': {
    icon: '🥩',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    items: ['carne', 'frango', 'peixe', 'porco', 'linguiça', 'salsicha', 'bacon', 'presunto', 'mortadela', 'peito de peru']
  },
  'Frutas': {
    icon: '🍎',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    items: ['maçã', 'banana', 'laranja', 'uva', 'pêra', 'abacaxi', 'manga', 'morango', 'melancia', 'limão', 'abacate']
  },
  'Verduras': {
    icon: '🥬',
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    items: ['alface', 'tomate', 'cebola', 'cenoura', 'batata', 'brócolis', 'couve', 'espinafre', 'abobrinha', 'pepino']
  },
  'Grãos e Cereais': {
    icon: '🌾',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    items: ['arroz', 'feijão', 'macarrão', 'aveia', 'quinoa', 'lentilha', 'grão de bico', 'farinha', 'açúcar', 'sal']
  },
  'Bebidas': {
    icon: '🥤',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    items: ['água', 'refrigerante', 'suco', 'cerveja', 'vinho', 'café', 'chá', 'energético', 'isotônico']
  },
  'Limpeza': {
    icon: '🧽',
    color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    items: ['detergente', 'sabão', 'amaciante', 'desinfetante', 'papel higiênico', 'papel toalha', 'esponja', 'vassoura']
  },
  'Higiene': {
    icon: '🧴',
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    items: ['shampoo', 'condicionador', 'sabonete', 'pasta de dente', 'escova de dente', 'desodorante', 'perfume']
  },
  'Padaria': {
    icon: '🍞',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    items: ['pão', 'bolo', 'biscoito', 'torrada', 'croissant', 'pão de açúcar', 'pão francês', 'pão integral']
  },
  'Congelados': {
    icon: '🧊',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    items: ['sorvete', 'pizza congelada', 'hambúrguer', 'batata frita', 'nuggets', 'peixe congelado', 'vegetais congelados']
  }
};

// Função para sugerir categoria baseada no nome do item
export const suggestCategory = (itemName) => {
  if (!itemName || typeof itemName !== 'string') return null;
  
  const normalizedName = itemName.toLowerCase().trim();
  
  // Procura por correspondências exatas ou parciais
  for (const [categoryName, categoryData] of Object.entries(CATEGORIES)) {
    const found = categoryData.items.some(item => {
      // Verifica se o nome do item contém alguma palavra-chave da categoria
      return normalizedName.includes(item.toLowerCase()) || 
             item.toLowerCase().includes(normalizedName);
    });
    
    if (found) {
      return {
        name: categoryName,
        ...categoryData
      };
    }
  }
  
  return null;
};

// Função para obter todas as categorias
export const getAllCategories = () => {
  return Object.entries(CATEGORIES).map(([name, data]) => ({
    name,
    ...data
  }));
};

// Função para agrupar itens por categoria
export const groupItemsByCategory = (items) => {
  const grouped = {
    'Sem Categoria': []
  };
  
  // Inicializa todas as categorias
  Object.keys(CATEGORIES).forEach(category => {
    grouped[category] = [];
  });
  
  // Agrupa os itens
  items.forEach(item => {
    const suggestedCategory = suggestCategory(item.name);
    const categoryName = suggestedCategory ? suggestedCategory.name : 'Sem Categoria';
    grouped[categoryName].push(item);
  });
  
  // Remove categorias vazias (exceto "Sem Categoria" se tiver itens)
  Object.keys(grouped).forEach(category => {
    if (grouped[category].length === 0 && category !== 'Sem Categoria') {
      delete grouped[category];
    }
  });
  
  // Remove "Sem Categoria" se estiver vazia
  if (grouped['Sem Categoria'].length === 0) {
    delete grouped['Sem Categoria'];
  }
  
  return grouped;
};

// Função para obter estatísticas de categorização
export const getCategoryStats = (items) => {
  const grouped = groupItemsByCategory(items);
  const totalCategories = Object.keys(grouped).length;
  const categorizedItems = items.filter(item => suggestCategory(item.name) !== null).length;
  const uncategorizedItems = items.length - categorizedItems;
  
  return {
    totalCategories,
    categorizedItems,
    uncategorizedItems,
    categorizationRate: items.length > 0 ? (categorizedItems / items.length) * 100 : 0
  };
};
