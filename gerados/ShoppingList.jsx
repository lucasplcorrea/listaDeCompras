import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Check, X, ShoppingBag, AlertCircle, Tag, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import { useShoppingLists } from '../hooks/useLocalStorage.js';
import { suggestCategory, groupItemsByCategory, getCategoryStats } from '../lib/categories.js';

const ShoppingList = ({ currentListId }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({ name: '', quantity: '', price: '' });
  const [showByCategory, setShowByCategory] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState(null);

  const { lists, updateList, getActiveList } = useShoppingLists();
  const activeList = getActiveList();

  // Atualiza a sugestão de categoria quando o nome do item muda
  useEffect(() => {
    if (itemName.trim()) {
      const suggestion = suggestCategory(itemName);
      setSuggestedCategory(suggestion);
    } else {
      setSuggestedCategory(null);
    }
  }, [itemName]);

  // Se não há lista ativa, mostra mensagem
  if (!activeList) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Nenhuma lista ativa encontrada. Vá para "Minhas Listas" para criar ou selecionar uma lista.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleAddItem = () => {
    if (itemName.trim()) {
      const newItem = {
        id: Date.now(),
        name: itemName.trim(),
        quantity: parseInt(quantity) || 1,
        price: parseFloat(price) || 0,
        completed: false,
        createdAt: new Date().toISOString(),
        category: suggestedCategory?.name || null
      };

      const updatedItems = [...activeList.items, newItem];
      updateList(activeList.id, { items: updatedItems });

      // Limpa o formulário
      setItemName('');
      setQuantity('1');
      setPrice('');
      setSuggestedCategory(null);
    }
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = activeList.items.filter(item => item.id !== itemId);
    updateList(activeList.id, { items: updatedItems });
  };

  const handleEditItem = (item) => {
    setEditingItem(item.id);
    setEditData({
      name: item.name,
      quantity: item.quantity.toString(),
      price: item.price.toString()
    });
  };

  const handleSaveEdit = () => {
    if (editData.name.trim()) {
      const updatedItems = activeList.items.map(item =>
        item.id === editingItem
          ? {
              ...item,
              name: editData.name.trim(),
              quantity: parseInt(editData.quantity) || 1,
              price: parseFloat(editData.price) || 0,
              category: suggestCategory(editData.name.trim())?.name || null
            }
          : item
      );
      updateList(activeList.id, { items: updatedItems });
      setEditingItem(null);
      setEditData({ name: '', quantity: '', price: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditData({ name: '', quantity: '', price: '' });
  };

  const toggleItemCompleted = (itemId) => {
    const updatedItems = activeList.items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateList(activeList.id, { items: updatedItems });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateTotals = () => {
    const totalItems = activeList.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = activeList.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const completedItems = activeList.items.filter(item => item.completed).length;
    
    return { totalItems, totalValue, completedItems };
  };

  const { totalItems, totalValue, completedItems } = calculateTotals();
  const categoryStats = getCategoryStats(activeList.items);
  const groupedItems = showByCategory ? groupItemsByCategory(activeList.items) : null;

  const renderItemsList = () => {
    if (showByCategory && groupedItems) {
      return (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([categoryName, categoryItems]) => {
            const categoryInfo = suggestCategory(categoryItems[0]?.name);
            return (
              <div key={categoryName} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="text-lg">
                    {categoryInfo?.icon || '📦'}
                  </div>
                  <h4 className="text-lg font-semibold text-foreground">{categoryName}</h4>
                  <Badge variant="secondary">{categoryItems.length} itens</Badge>
                </div>
                <div className="space-y-3 pl-6">
                  {categoryItems.map((item) => renderItem(item))}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="space-y-3">
          {activeList.items.map((item) => renderItem(item))}
        </div>
      );
    }
  };

  const renderItem = (item) => (
    <div
      key={item.id}
      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
        item.completed 
          ? 'bg-muted/50 border-muted' 
          : 'bg-card border-border hover:border-primary/50 hover:shadow-sm'
      }`}
    >
      {editingItem === item.id ? (
        // Modo de edição
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <Input
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              placeholder="Nome do item"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
            />
          </div>
          <div>
            <Input
              type="number"
              min="1"
              value={editData.quantity}
              onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
              placeholder="Quantidade"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={editData.price}
              onChange={(e) => setEditData({ ...editData, price: e.target.value })}
              placeholder="Preço"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
            />
            <Button size="sm" onClick={handleSaveEdit} disabled={!editData.name.trim()}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        // Modo de visualização
        <>
          <div className="flex items-center space-x-3 flex-1">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItemCompleted(item.id)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <div className={item.completed ? 'opacity-50' : ''}>
              <div className="flex items-center space-x-2">
                <h5 className={`font-medium text-foreground ${item.completed ? 'line-through' : ''}`}>
                  {item.name}
                </h5>
                {item.category && (
                  <Badge variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {item.category}
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Qtd: {item.quantity}</span>
                <span>Preço: {formatCurrency(item.price)}</span>
                <span className="font-medium text-primary">
                  Total: {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleEditItem(item)}
              title="Editar item"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleRemoveItem(item.id)}
              title="Remover item"
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header da lista ativa */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                {activeList.name}
              </CardTitle>
              <CardDescription>
                Adicione itens à sua lista de compras com quantidade e preço.
              </CardDescription>
            </div>
            <Badge variant="default">Lista Ativa</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Formulário para adicionar item */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-6">
            <div className="sm:col-span-2">
              <Label htmlFor="item-name">Item</Label>
              <Input
                id="item-name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Nome do item"
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              />
              {/* Sugestão de categoria */}
              {suggestedCategory && (
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Categoria sugerida:</span>
                  <Badge variant="outline" className={suggestedCategory.color}>
                    <span className="mr-1">{suggestedCategory.icon}</span>
                    {suggestedCategory.name}
                  </Badge>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              />
            </div>
            <div>
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0,00"
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              />
            </div>
          </div>
          
          <Button onClick={handleAddItem} disabled={!itemName.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        </CardContent>
      </Card>

      {/* Lista de itens */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Itens da Lista ({activeList.items.length})</CardTitle>
            {activeList.items.length > 0 && (
              <div className="flex items-center space-x-2">
                <Label htmlFor="group-by-category" className="text-sm">
                  Agrupar por categoria
                </Label>
                <Switch
                  id="group-by-category"
                  checked={showByCategory}
                  onCheckedChange={setShowByCategory}
                />
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
          {/* Estatísticas de categorização */}
          {activeList.items.length > 0 && categoryStats.categorizedItems > 0 && (
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{categoryStats.categorizedItems} categorizados</span>
              <span>{categoryStats.uncategorizedItems} sem categoria</span>
              <Badge variant="secondary">
                {Math.round(categoryStats.categorizationRate)}% categorizados
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {activeList.items.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-2">
                <Plus className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-muted-foreground">Nenhum item na lista ainda.</p>
              <p className="text-sm text-muted-foreground">Adicione itens usando o formulário acima.</p>
            </div>
          ) : (
            renderItemsList()
          )}
        </CardContent>
      </Card>

      {/* Resumo da compra */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Compra</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-2xl font-bold text-primary">{totalItems}</p>
              <p className="text-sm text-muted-foreground">Total de Itens</p>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</p>
              <p className="text-sm text-muted-foreground">Valor Total</p>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{completedItems}/{activeList.items.length}</p>
              <p className="text-sm text-muted-foreground">Itens Comprados</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShoppingList;
