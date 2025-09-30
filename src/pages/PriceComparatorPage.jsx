import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Calculator, Trophy } from 'lucide-react';

const units = [
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'g', label: 'Grama (g)' },
  { value: 'l', label: 'Litro (L)' },
  { value: 'ml', label: 'Mililitro (ml)' },
  { value: 'un', label: 'Unidade' },
  { value: 'pct', label: 'Pacote' }
];

export function PriceComparatorPage() {
  const { state, dispatch } = useApp();
  const [products, setProducts] = useState([
    { id: 1, name: '', price: 0, quantity: 0, unit: 'kg' }
  ]);

  const addProduct = () => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts([...products, { id: newId, name: '', price: 0, quantity: 0, unit: 'kg' }]);
  };

  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const updateProduct = (id, field, value) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const calculatePricePerUnit = (product) => {
    if (!product.quantity || !product.price) return 0;
    
    let normalizedQuantity = product.quantity;
    
    // Normalizar para unidades base (kg, L, unidade)
    if (product.unit === 'g') {
      normalizedQuantity = product.quantity / 1000;
    } else if (product.unit === 'ml') {
      normalizedQuantity = product.quantity / 1000;
    }
    
    return product.price / normalizedQuantity;
  };

  const getDisplayUnit = (unit) => {
    if (unit === 'g') return 'kg';
    if (unit === 'ml') return 'L';
    return unit;
  };

  const validProducts = products.filter(p => p.name && p.price > 0 && p.quantity > 0);
  const bestProduct = validProducts.length > 0 
    ? validProducts.reduce((best, current) => 
        calculatePricePerUnit(current) < calculatePricePerUnit(best) ? current : best
      )
    : null;

  const saveComparison = () => {
    if (validProducts.length < 2) return;
    
    const comparison = {
      id: Date.now().toString(),
      products: validProducts.map(p => ({ ...p })),
      bestProductId: bestProduct?.id,
      createdAt: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_PRICE_COMPARISON', payload: comparison });
    
    // Reset form
    setProducts([{ id: 1, name: '', price: 0, quantity: 0, unit: 'kg' }]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Comparador de Preços
        </h1>
        <p className="text-muted-foreground">
          Compare produtos por preço unitário para encontrar a melhor opção
        </p>
      </div>

      {/* Products form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Produtos para Comparar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {products.map((product, index) => (
            <div key={product.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
              <div className="md:col-span-2">
                <Input
                  placeholder="Nome do produto"
                  value={product.name}
                  onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Preço (R$)"
                  min="0"
                  step="0.01"
                  value={product.price || ''}
                  onChange={(e) => updateProduct(product.id, 'price', Number(e.target.value))}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Quantidade"
                  min="0"
                  step="0.01"
                  value={product.quantity || ''}
                  onChange={(e) => updateProduct(product.id, 'quantity', Number(e.target.value))}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={product.unit}
                  onValueChange={(value) => updateProduct(product.id, 'unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {products.length > 1 && (
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => removeProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Button onClick={addProduct} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
            {validProducts.length >= 2 && (
              <Button onClick={saveComparison}>
                Salvar Comparação
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {validProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados da Comparação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {validProducts
                .sort((a, b) => calculatePricePerUnit(a) - calculatePricePerUnit(b))
                .map((product, index) => {
                  const pricePerUnit = calculatePricePerUnit(product);
                  const isBest = product.id === bestProduct?.id;
                  
                  return (
                    <div
                      key={product.id}
                      className={`p-4 rounded-lg border ${
                        isBest ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isBest && <Trophy className="h-5 w-5 text-green-600" />}
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              R$ {product.price.toFixed(2)} por {product.quantity} {product.unit}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${isBest ? 'text-green-600' : ''}`}>
                            R$ {pricePerUnit.toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            por {getDisplayUnit(product.unit)}
                          </div>
                        </div>
                      </div>
                      {isBest && (
                        <div className="mt-2 text-sm text-green-600 font-medium">
                          🏆 Melhor custo-benefício!
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved comparisons */}
      {state.priceComparisons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparações Salvas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {state.priceComparisons.map((comparison, index) => (
                <div key={comparison.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">
                      Comparação {index + 1}
                    </h4>
                    <div className="flex gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(comparison.createdAt).toLocaleDateString()}
                      </span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => dispatch({ type: 'DELETE_PRICE_COMPARISON', payload: index })}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                    {comparison.products.map((product) => (
                      <div
                        key={product.id}
                        className={`p-2 rounded ${
                          product.id === comparison.bestProductId
                            ? 'bg-green-100 dark:bg-green-900'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="font-medium">{product.name}</div>
                        <div className="text-muted-foreground">
                          R$ {calculatePricePerUnit(product).toFixed(2)}/{getDisplayUnit(product.unit)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
