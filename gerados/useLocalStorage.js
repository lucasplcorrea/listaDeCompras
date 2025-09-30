import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Função para obter o valor do localStorage
  const getStoredValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage para a chave "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Função para atualizar o valor
  const setValue = (value) => {
    try {
      // Permite que value seja uma função como no useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage para a chave "${key}":`, error);
    }
  };

  // Função para remover o valor
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Erro ao remover do localStorage para a chave "${key}":`, error);
    }
  };

  // Escuta mudanças no localStorage de outras abas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Hook específico para gerenciar listas de compras
export const useShoppingLists = () => {
  const [lists, setLists, removeLists] = useLocalStorage('shopping-lists', []);
  const [activeListId, setActiveListId, removeActiveListId] = useLocalStorage('active-list-id', null);

  // Função para criar uma nova lista
  const createList = (name) => {
    const newList = {
      id: Date.now(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
      isActive: false
    };

    setLists(prevLists => {
      // Desativa todas as outras listas
      const updatedLists = prevLists.map(list => ({ ...list, isActive: false }));
      // Adiciona a nova lista como ativa
      return [...updatedLists, { ...newList, isActive: true }];
    });

    setActiveListId(newList.id);
    return newList;
  };

  // Função para atualizar uma lista
  const updateList = (listId, updates) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? { ...list, ...updates, updatedAt: new Date().toISOString() }
          : list
      )
    );
  };

  // Função para deletar uma lista
  const deleteList = (listId) => {
    setLists(prevLists => {
      const filteredLists = prevLists.filter(list => list.id !== listId);
      
      // Se a lista deletada era a ativa, define uma nova lista ativa
      if (activeListId === listId) {
        const newActiveList = filteredLists.length > 0 ? filteredLists[0] : null;
        if (newActiveList) {
          setActiveListId(newActiveList.id);
          // Marca a nova lista como ativa
          return filteredLists.map(list =>
            list.id === newActiveList.id ? { ...list, isActive: true } : { ...list, isActive: false }
          );
        } else {
          setActiveListId(null);
        }
      }
      
      return filteredLists;
    });
  };

  // Função para duplicar uma lista
  const duplicateList = (listId) => {
    const listToDuplicate = lists.find(list => list.id === listId);
    if (listToDuplicate) {
      const duplicatedList = {
        ...listToDuplicate,
        id: Date.now(),
        name: `${listToDuplicate.name} (Cópia)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: false
      };

      setLists(prevLists => [...prevLists, duplicatedList]);
      return duplicatedList;
    }
  };

  // Função para definir lista ativa
  const setActiveList = (listId) => {
    setLists(prevLists =>
      prevLists.map(list => ({
        ...list,
        isActive: list.id === listId
      }))
    );
    setActiveListId(listId);
  };

  // Função para obter a lista ativa
  const getActiveList = () => {
    return lists.find(list => list.id === activeListId) || null;
  };

  // Função para obter estatísticas
  const getStats = () => {
    const totalLists = lists.length;
    const totalItems = lists.reduce((sum, list) => sum + list.items.length, 0);
    const totalValue = lists.reduce((sum, list) => 
      sum + list.items.reduce((itemSum, item) => 
        itemSum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0), 0
      ), 0
    );

    return { totalLists, totalItems, totalValue };
  };

  return {
    lists,
    activeListId,
    createList,
    updateList,
    deleteList,
    duplicateList,
    setActiveList,
    getActiveList,
    getStats,
    clearAllLists: removeLists
  };
};
