import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

// Estado inicial
const initialState = {
  currentListId: 'default',
  lists: {
    default: {
      id: 'default',
      name: 'Lista Principal',
      items: [],
      createdAt: new Date().toISOString()
    }
  },
  priceComparisons: [],
  categories: [
    'Alimentos Básicos', 'Laticínios', 'Carnes', 'Hortifrúti', 'Bebidas',
    'Limpeza', 'Higiene Pessoal', 'Congelados', 'Padaria', 'Mercearia', 'Outros'
  ]
};

// Reducer para gerenciar as ações
function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    case 'ADD_ITEM':
      return {
        ...state,
        lists: {
          ...state.lists,
          [state.currentListId]: {
            ...state.lists[state.currentListId],
            items: [...state.lists[state.currentListId].items, { ...action.payload, category: action.payload.category || 'Outros' }]
          }
        }
      };

    case 'UPDATE_ITEM':
      return {
        ...state,
        lists: {
          ...state.lists,
          [state.currentListId]: {
            ...state.lists[state.currentListId],
            items: state.lists[state.currentListId].items.map(item =>
              item.id === action.payload.id ? { ...item, ...action.payload, category: action.payload.category || 'Outros' } : item
            )
          }
        }
      };

    case 'DELETE_ITEM':
      return {
        ...state,
        lists: {
          ...state.lists,
          [state.currentListId]: {
            ...state.lists[state.currentListId],
            items: state.lists[state.currentListId].items.filter(item => item.id !== action.payload)
          }
        }
      };

    case 'CREATE_LIST':
      const newListId = Date.now().toString();
      return {
        ...state,
        lists: {
          ...state.lists,
          [newListId]: {
            id: newListId,
            name: action.payload.name,
            items: [],
            createdAt: new Date().toISOString()
          }
        }
      };

    case 'DELETE_LIST':
      const { [action.payload]: deletedList, ...remainingLists } = state.lists;
      const newCurrentListId = state.currentListId === action.payload 
        ? Object.keys(remainingLists)[0] || 'default'
        : state.currentListId;
      
      return {
        ...state,
        currentListId: newCurrentListId,
        lists: remainingLists
      };

    case 'SET_CURRENT_LIST':
      return {
        ...state,
        currentListId: action.payload
      };

    case 'ADD_PRICE_COMPARISON':
      return {
        ...state,
        priceComparisons: [...state.priceComparisons, action.payload]
      };

    case 'DELETE_PRICE_COMPARISON':
      return {
        ...state,
        priceComparisons: state.priceComparisons.filter((_, index) => index !== action.payload)
      };

    case 'CLEAR_ALL_DATA':
      return initialState;

    case 'CLEAR_PRICES_QUANTITIES':
      return {
        ...state,
        lists: {
          ...state.lists,
          [state.currentListId]: {
            ...state.lists[state.currentListId],
            items: state.lists[state.currentListId].items.map(item => ({
              ...item,
              price: 0,
              quantity: 1
            }))
          }
        }
      };

    default:
      return state;
  }
}

// Provider do contexto
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedState = localStorage.getItem('lista-compras-app');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error);
      }
    }
  }, []);

  // Salvar no localStorage sempre que o estado mudar
  useEffect(() => {
    localStorage.setItem('lista-compras-app', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook para usar o contexto
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
}
