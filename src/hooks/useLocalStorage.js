import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gerenciar dados no localStorage
 * @param {string} key - Chave para armazenar no localStorage
 * @param {any} initialValue - Valor inicial caso não exista dados no localStorage
 * @returns {Array} - [storedValue, setValue] - Valor armazenado e função para atualizar
 */
const useLocalStorage = (key, initialValue) => {
  // Estado para armazenar o valor atual
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Obter do localStorage pelo key
      const item = window.localStorage.getItem(key);
      // Analisar o item armazenado ou retornar initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se ocorrer erro, retornar initialValue
      console.error(`Erro ao obter item '${key}' do localStorage:`, error);
      return initialValue;
    }
  });

  // Função para atualizar o valor no localStorage e no estado
  const setValue = (value) => {
    try {
      // Permitir que value seja uma função para seguir o mesmo padrão do useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Salvar no estado
      setStoredValue(valueToStore);
      // Salvar no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao armazenar item '${key}' no localStorage:`, error);
    }
  };

  // Atualizar o localStorage se a chave mudar
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Erro ao atualizar item '${key}' no localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
};

export default useLocalStorage;