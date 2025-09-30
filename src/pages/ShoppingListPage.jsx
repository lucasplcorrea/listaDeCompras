import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit3, Check, X, Tag } from 'lucide-react';

export function ShoppingListPage() {
  const { state, dispatch } = useApp();
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, price: 0, category: 'Outros' });
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState({});

  const currentList = state.lists[state.currentListId];
  const items = currentList?.items || [];
  const categories = state.categories || [];

  const addItem = () => {
    if (!newItem.name.trim()) return;
    
    const item = {
      id: Date.now().toString(),
      name: newItem.name.trim(),
      quantity: Number(newItem.quantity) || 1,
      price: Number(newItem.price) || 0,
      completed: false,
      category: newItem.category,
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_ITEM', payload: item });
    setNewItem({ name: '', quantity: 1, price: 0, category: 'Outros' });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditingItem({ ...item });
  };

  const saveEdit = () => {
    dispatch({ type: 'UPDATE_ITEM', payload: editingItem });
    setEditingId(null);
    setEditingItem({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingItem({});
  };

  const deleteItem = (id) => {
    dispatch({ type: 'DELETE_ITEM', payload: id });
  };

  const toggleCompleted = (item) => {
    dispatch({ 
      type: 'UPDATE_ITEM', 
      payload: { ...item, completed: !item.completed }
    });
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  // Agrupar itens por categoria
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {currentList?.name || 'Lista de Compras'}
        </h1>
        <p className="text-muted-foreground">
          Adicione itens à sua lista e acompanhe o total da compra
        </p>
      </div>

      {/* Add new item form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Item
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome do Item
              </label>
              <Input
                placeholder="Ex: Arroz, Feijão, Leite..."
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Quantidade
              </label>
              <Input
                type="number"
                placeholder="1"
                min="1"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Preço Unitário (R$)
              </label>
              <Input
                type="number"
                placeholder="0,00"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
            </div>
            <div className="md:col-span-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Categoria
              </label>
              <Select
                value={newItem.category}
                onValueChange={(value) => setNewItem({ ...newItem, category: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addItem} className="mt-4 w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        </CardContent>
      </Card>

      {/* Items list */}
      <div className="space-y-4">
        {Object.keys(groupedItems).sort().map(category => (
          <div key={category} className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground mt-6 mb-2 flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" /> {category}
            </h2>
            {groupedItems[category].map((item) => (
              <Card key={item.id} className={`transition-opacity ${item.completed ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  {editingId === item.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Nome do Item
                        </label>
                        <Input
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Quantidade
                        </label>
                        <Input
                          type="number"
                          min="1"
                          value={editingItem.quantity}
                          onChange={(e) => setEditingItem({ ...editingItem, quantity: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Preço Unitário (R$)
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Categoria
                        </label>
                        <Select
                          value={editingItem.category}
                          onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 md:col-span-5 justify-end">
                        <Button size="sm" onClick={saveEdit}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleCompleted(item)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <div className="flex-1">
                          <h3 className={`font-medium ${item.completed ? 'line-through' : ''}`}>
                            {item.name}
                          </h3>
                          <div className="text-sm text-muted-foreground">
                            Quantidade: {item.quantity} | Preço unitário: R$ {item.price.toFixed(2)}
                            {item.category && <span className="ml-2 text-xs px-2 py-0.5 bg-muted rounded-full">{item.category}</span>}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            R$ {(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ))}

        {items.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                Nenhum item na lista. Adicione alguns itens para começar!
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary */}
      {items.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {totalItems}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total de Itens
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  R$ {totalPrice.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total da Compra
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
