import { useState } from 'react';
import { Plus, Calculator, Trash2, Edit3, Check, X, TrendingDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { usePriceComparator } from '../hooks/usePriceComparator.js';

const PriceComparator = () => {
  const [productName, setProductName] = useState('');
  const [unit, setUnit] = useState('');
  const [amount, setAmount] = useState('');
  const [packagePrice, setPackagePrice] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState({ name: '', unit: '', amount: '', packagePrice: '' });

  const {
    products,
    addProduct,
    updateProduct,
    removeProduct,
    getProductsByUnit,
    isBestProduct,
    getStats,
    formatPricePerUnit
  } = usePriceComparator();

  const stats = getStats();
  const productsByUnit = getProductsByUnit();

  const handleAddProduct = () => {
    if (productName.trim() && unit && amount && packagePrice) {
      addProduct({
        name: productName,
        unit,
        amount,
        packagePrice
      });
      
      // Limpa o formulário
      setProductName('');
      setUnit('');
      setAmount('');
      setPackagePrice('');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setEditData({
      name: product.name,
      unit: product.unit,
      amount: product.amount.toString(),
      packagePrice: product.packagePrice.toString()
    });
  };

  const handleSaveEdit = () => {
    if (editData.name.trim() && editData.unit && editData.amount && editData.packagePrice) {
      updateProduct(editingProduct, {
        name: editData.name.trim(),
        unit: editData.unit,
        amount: parseFloat(editData.amount),
        packagePrice: parseFloat(editData.packagePrice)
      });
      setEditingProduct(null);
      setEditData({ name: '', unit: '', amount: '', packagePrice: '' });
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditData({ name: '', unit: '', amount: '', packagePrice: '' });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getUnitLabel = (unitValue) => {
    const unitLabels = {
      kg: 'Quilogramas (kg)',
      g: 'Gramas (g)',
      l: 'Litros (L)',
      ml: 'Mililitros (mL)',
      un: 'Unidades'
    };
    return unitLabels[unitValue] || unitValue;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comparador de Preços por Porção</CardTitle>
          <CardDescription>
            Compare produtos diferentes para descobrir qual oferece o melhor custo-benefício por unidade de medida.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Formulário para adicionar produto */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5 mb-6">
            <div>
              <Label htmlFor="product-name">Produto</Label>
              <Input
                id="product-name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Nome do produto"
                onKeyPress={(e) => e.key === 'Enter' && handleAddProduct()}
              />
            </div>
            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="g">Gramas</SelectItem>
                  <SelectItem value="l">Litros</SelectItem>
                  <SelectItem value="ml">ML</SelectItem>
                  <SelectItem value="un">Unidades</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Quantidade</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1.0"
                onKeyPress={(e) => e.key === 'Enter' && handleAddProduct()}
              />
            </div>
            <div>
              <Label htmlFor="package-price">Preço da Embalagem (R$)</Label>
              <Input
                id="package-price"
                type="number"
                step="0.01"
                min="0"
                value={packagePrice}
                onChange={(e) => setPackagePrice(e.target.value)}
                placeholder="0,00"
                onKeyPress={(e) => e.key === 'Enter' && handleAddProduct()}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddProduct} 
                className="w-full"
                disabled={!productName.trim() || !unit || !amount || !packagePrice}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resultados da comparação */}
      <Card>
        <CardHeader>
          <CardTitle>Comparação de Preços</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-2">
                <Calculator className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-muted-foreground">Nenhum produto para comparar ainda.</p>
              <p className="text-sm text-muted-foreground">Adicione produtos usando o formulário acima.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(productsByUnit).map(([unitType, unitProducts]) => (
                <div key={unitType} className="space-y-3">
                  <h4 className="text-lg font-semibold text-foreground flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    {getUnitLabel(unitType)}
                  </h4>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Produto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Quantidade
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Preço da Embalagem
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Preço por Unidade
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {unitProducts.map((product) => (
                          <tr key={product.id} className={isBestProduct(product) ? 'bg-green-50 dark:bg-green-950/20' : ''}>
                            {editingProduct === product.id ? (
                              // Modo de edição
                              <>
                                <td className="px-6 py-4">
                                  <Input
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    placeholder="Nome do produto"
                                    className="min-w-[150px]"
                                  />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center space-x-2">
                                    <Input
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      value={editData.amount}
                                      onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                                      className="w-20"
                                    />
                                    <Select 
                                      value={editData.unit} 
                                      onValueChange={(value) => setEditData({ ...editData, unit: value })}
                                    >
                                      <SelectTrigger className="w-20">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="kg">kg</SelectItem>
                                        <SelectItem value="g">g</SelectItem>
                                        <SelectItem value="l">L</SelectItem>
                                        <SelectItem value="ml">mL</SelectItem>
                                        <SelectItem value="un">un</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={editData.packagePrice}
                                    onChange={(e) => setEditData({ ...editData, packagePrice: e.target.value })}
                                    className="w-24"
                                  />
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                  Calculando...
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center space-x-2">
                                    <Button size="sm" onClick={handleSaveEdit}>
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                                <td></td>
                              </>
                            ) : (
                              // Modo de visualização
                              <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                  {product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                  {product.amount} {product.unit}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                  {formatCurrency(product.packagePrice)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                  {formatPricePerUnit(product)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {isBestProduct(product) ? (
                                    <Badge variant="default" className="bg-green-600">
                                      <TrendingDown className="h-3 w-3 mr-1" />
                                      Melhor Opção
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">Comparar</Badge>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex items-center space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleEditProduct(product)}
                                      title="Editar produto"
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => removeProduct(product.id)}
                                      title="Remover produto"
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estatísticas */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas da Comparação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-2xl font-bold text-primary">{stats.totalProducts}</p>
                <p className="text-sm text-muted-foreground">Produtos Comparados</p>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.totalUnits}</p>
                <p className="text-sm text-muted-foreground">Categorias</p>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.potentialSavings)}
                </p>
                <p className="text-sm text-muted-foreground">Economia Potencial</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dica para novos usuários */}
      {products.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Dica:</strong> Adicione produtos da mesma categoria (ex: diferentes marcas de leite) para comparar qual oferece o melhor preço por litro, quilo ou unidade.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PriceComparator;
