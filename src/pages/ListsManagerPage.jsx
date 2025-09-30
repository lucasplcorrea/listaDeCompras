import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, FolderOpen, Calendar, ShoppingCart } from 'lucide-react';

export function ListsManagerPage() {
  const { state, dispatch } = useApp();
  const [newListName, setNewListName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const createList = () => {
    if (!newListName.trim()) return;
    
    dispatch({ 
      type: 'CREATE_LIST', 
      payload: { name: newListName.trim() }
    });
    
    setNewListName('');
    setShowCreateForm(false);
  };

  const deleteList = (listId) => {
    if (Object.keys(state.lists).length <= 1) {
      alert('Você deve manter pelo menos uma lista!');
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita.')) {
      dispatch({ type: 'DELETE_LIST', payload: listId });
    }
  };

  const switchToList = (listId) => {
    dispatch({ type: 'SET_CURRENT_LIST', payload: listId });
  };

  const getListStats = (list) => {
    const totalItems = list.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = list.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const completedItems = list.items.filter(item => item.completed).length;
    
    return { totalItems, totalPrice, completedItems, totalProducts: list.items.length };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Minhas Listas
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas listas de compras e alterne entre elas
        </p>
      </div>

      {/* Create new list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nova Lista
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showCreateForm ? (
            <div className="space-y-4">
              <Input
                placeholder="Nome da nova lista"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createList()}
              />
              <div className="flex gap-2">
                <Button onClick={createList}>
                  Criar Lista
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Nova Lista
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Lists grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(state.lists).map((list) => {
          const stats = getListStats(list);
          const isActive = list.id === state.currentListId;
          
          return (
            <Card 
              key={list.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isActive ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => switchToList(list.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    {list.name}
                  </CardTitle>
                  {isActive && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      Ativa
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span>{stats.totalProducts} produtos</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">
                      {stats.totalItems} itens
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    {stats.completedItems} concluídos
                  </div>
                  <div className="text-right font-medium text-primary">
                    R$ {stats.totalPrice.toFixed(2)}
                  </div>
                </div>

                {/* Created date */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Criada em {new Date(list.createdAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {!isActive && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        switchToList(list.id);
                      }}
                    >
                      Ativar
                    </Button>
                  )}
                  {Object.keys(state.lists).length > 1 && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteList(list.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current list info */}
      {state.currentListId && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">
              <strong>Lista Ativa:</strong> {state.lists[state.currentListId]?.name}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Todos os itens que você adicionar serão salvos nesta lista
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
