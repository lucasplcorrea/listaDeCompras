import { useState } from 'react';
import { Plus, Calendar, ShoppingCart, Trash2, Edit3, Copy, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { useShoppingLists } from '../hooks/useLocalStorage.js';

const ListManager = ({ onSelectList, onCreateList }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingList, setEditingList] = useState(null);
  const [editName, setEditName] = useState('');

  const {
    lists,
    createList,
    updateList,
    deleteList,
    duplicateList,
    setActiveList,
    getStats
  } = useShoppingLists();

  const stats = getStats();

  const handleCreateList = () => {
    if (newListName.trim()) {
      const newList = createList(newListName);
      setNewListName('');
      setShowCreateForm(false);
      onSelectList(newList.id);
      onCreateList();
    }
  };

  const handleSelectList = (listId) => {
    setActiveList(listId);
    onSelectList(listId);
    onCreateList(); // Navega para a tela de lista ativa
  };

  const handleEditList = (list) => {
    setEditingList(list.id);
    setEditName(list.name);
  };

  const handleSaveEdit = () => {
    if (editName.trim()) {
      updateList(editingList, { name: editName.trim() });
      setEditingList(null);
      setEditName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingList(null);
    setEditName('');
  };

  const handleDuplicateList = (listId) => {
    duplicateList(listId);
  };

  const handleDeleteList = (listId) => {
    if (window.confirm('Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita.')) {
      deleteList(listId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateListTotal = (list) => {
    return list.items.reduce((sum, item) => 
      sum + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0), 0
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com botão de criar lista */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Minhas Listas de Compras</CardTitle>
              <CardDescription>
                Gerencie suas listas de compras. Você pode criar, editar e organizar múltiplas listas para diferentes ocasiões.
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Lista
            </Button>
          </div>

          {/* Formulário para criar nova lista */}
          {showCreateForm && (
            <div className="border border-border rounded-lg p-4 mt-4 bg-muted/50">
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <Input
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Nome da nova lista"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
                    autoFocus
                  />
                </div>
                <Button onClick={handleCreateList} size="sm" disabled={!newListName.trim()}>
                  Criar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewListName('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Lista de listas existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Listas Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {lists.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-2">
                <ShoppingCart className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-muted-foreground">Nenhuma lista criada ainda.</p>
              <p className="text-sm text-muted-foreground">Clique em "Nova Lista" para começar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lists.map((list) => (
                <div
                  key={list.id}
                  className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                    list.isActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {editingList === list.id ? (
                          <div className="flex items-center space-x-2 flex-1">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              className="max-w-xs"
                              autoFocus
                            />
                            <Button size="sm" onClick={handleSaveEdit} disabled={!editName.trim()}>
                              Salvar
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <>
                            <h5 className="font-medium text-foreground">{list.name}</h5>
                            {list.isActive && (
                              <Badge variant="default">Ativa</Badge>
                            )}
                          </>
                        )}
                      </div>
                      {editingList !== list.id && (
                        <div className="mt-1 flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(list.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {list.items.length} itens
                          </div>
                          <div className="font-medium text-primary">
                            {formatCurrency(calculateListTotal(list))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {editingList !== list.id && (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleSelectList(list.id)}
                        >
                          Abrir
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDuplicateList(list.id)}
                          title="Duplicar lista"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditList(list)}
                          title="Editar nome"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteList(list.id)}
                          title="Excluir lista"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas rápidas */}
      {lists.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-2xl font-bold text-primary">{stats.totalLists}</p>
                <p className="text-sm text-muted-foreground">Total de Listas</p>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.totalItems}</p>
                <p className="text-sm text-muted-foreground">Total de Itens</p>
              </div>
              <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.totalValue)}
                </p>
                <p className="text-sm text-muted-foreground">Valor Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dica para novos usuários */}
      {lists.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Dica:</strong> Comece criando sua primeira lista de compras. Você pode ter múltiplas listas para diferentes ocasiões, como "Compras da Semana", "Lista do Churrasco", etc.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ListManager;
