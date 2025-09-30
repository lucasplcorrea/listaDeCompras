// Gerenciamento de múltiplas listas de compras

// Função para obter todas as listas salvas
export const getShoppingLists = () => {
  const savedLists = localStorage.getItem('shoppingLists');
  return savedLists ? JSON.parse(savedLists) : [];
};

// Função para salvar todas as listas
export const saveShoppingLists = (lists) => {
  localStorage.setItem('shoppingLists', JSON.stringify(lists));
};

// Função para obter uma lista específica por ID
export const getShoppingListById = (listId) => {
  const lists = getShoppingLists();
  return lists.find(list => list.id === listId) || null;
};

// Função para salvar uma lista específica
export const saveShoppingList = (list) => {
  const lists = getShoppingLists();
  const existingIndex = lists.findIndex(l => l.id === list.id);
  
  if (existingIndex >= 0) {
    lists[existingIndex] = list;
  } else {
    lists.push(list);
  }
  
  saveShoppingLists(lists);
  return list;
};

// Função para criar uma nova lista
export const createShoppingList = (name) => {
  const newList = {
    id: Date.now().toString(),
    name: name || 'Nova Lista',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: []
  };
  
  saveShoppingList(newList);
  return newList;
};

// Função para excluir uma lista
export const deleteShoppingList = (listId) => {
  const lists = getShoppingLists();
  const updatedLists = lists.filter(list => list.id !== listId);
  saveShoppingLists(updatedLists);
};

// Função para importar uma lista existente
export const importShoppingList = (sourceListId, newName) => {
  const sourceList = getShoppingListById(sourceListId);
  
  if (!sourceList) return null;
  
  const newList = {
    ...sourceList,
    id: Date.now().toString(),
    name: newName || `Cópia de ${sourceList.name}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  saveShoppingList(newList);
  return newList;
};