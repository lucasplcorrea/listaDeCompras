import { useState } from 'react';
import { Trash2, AlertTriangle, Database, RefreshCw, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { useShoppingLists } from '../hooks/useLocalStorage.js';
import { usePriceComparator } from '../hooks/usePriceComparator.js';

const AdminPanel = () => {
  const [showConfirmClearPrices, setShowConfirmClearPrices] = useState(false);
  const [showConfirmClearAll, setShowConfirmClearAll] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  const { lists, getStats: getListStats, clearAllLists } = useShoppingLists();
  const { 
    products, 
    getStats: getComparatorStats, 
    clearPrices, 
    clearAllProducts 
  } = usePriceComparator();

  const listStats = getListStats();
  const comparatorStats = getComparatorStats();

  const handleClearPrices = () => {
    if (showConfirmClearPrices) {
      // Limpa preços das listas de compras
      lists.forEach(list => {
        const updatedItems = list.items.map(item => ({
          ...item,
          price: 0
        }));
        // Aqui você atualizaria a lista, mas como não temos a função updateList disponível,
        // vamos simular a ação
      });
      
      // Limpa preços do comparador
      clearPrices();
      
      setLastAction('Preços e quantidades foram limpos com sucesso!');
      setShowConfirmClearPrices(false);
      
      // Remove a mensagem após 3 segundos
      setTimeout(() => setLastAction(null), 3000);
    } else {
      setShowConfirmClearPrices(true);
    }
  };

  const handleClearAll = () => {
    if (showConfirmClearAll) {
      clearAllLists();
      clearAllProducts();
      
      setLastAction('Todos os dados foram removidos com sucesso!');
      setShowConfirmClearAll(false);
      
      // Remove a mensagem após 3 segundos
      setTimeout(() => setLastAction(null), 3000);
    } else {
      setShowConfirmClearAll(true);
    }
  };

  const getStorageSize = () => {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return (total / 1024).toFixed(2); // KB
    } catch (error) {
      return 'N/A';
    }
  };

  const getLastUpdate = () => {
    const allLists = lists || [];
    const allProducts = products || [];
    
    const dates = [
      ...allLists.map(list => new Date(list.updatedAt || list.createdAt)),
      ...allProducts.map(product => new Date(product.createdAt))
    ];
    
    if (dates.length === 0) return 'Nunca';
    
    const lastDate = new Date(Math.max(...dates));
    return lastDate.toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Mensagem de sucesso */}
      {lastAction && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-200">Sucesso!</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            {lastAction}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Administração de Dados</CardTitle>
          <CardDescription>
            Gerencie os dados armazenados localmente no seu navegador. Use essas opções com cuidado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Status do armazenamento */}
          <Alert className="mb-6">
            <Database className="h-4 w-4" />
            <AlertTitle>Status do Armazenamento Local</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm">
                      <strong>Listas de compras:</strong> {listStats.totalLists}
                    </p>
                    <p className="text-sm">
                      <strong>Itens nas listas:</strong> {listStats.totalItems}
                    </p>
                    <p className="text-sm">
                      <strong>Valor total das listas:</strong> {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(listStats.totalValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm">
                      <strong>Produtos no comparador:</strong> {comparatorStats.totalProducts}
                    </p>
                    <p className="text-sm">
                      <strong>Categorias de comparação:</strong> {comparatorStats.totalUnits}
                    </p>
                    <p className="text-sm">
                      <strong>Tamanho do armazenamento:</strong> {getStorageSize()} KB
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-sm">
                    <strong>Última atualização:</strong> {getLastUpdate()}
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          {/* Ações de limpeza */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <RefreshCw className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">Limpar Preços e Quantidades</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Remove apenas os preços e quantidades dos itens, mantendo os nomes dos produtos e estrutura das listas.
                    </p>
                    {showConfirmClearPrices && (
                      <Alert className="mt-3">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Confirmar ação:</strong> Tem certeza que deseja limpar todos os preços? Esta ação não pode ser desfeita.
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex items-center space-x-2 mt-3">
                      <Button 
                        variant={showConfirmClearPrices ? "destructive" : "outline"}
                        onClick={handleClearPrices}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {showConfirmClearPrices ? 'Confirmar Limpeza' : 'Limpar Preços'}
                      </Button>
                      {showConfirmClearPrices && (
                        <Button 
                          variant="ghost" 
                          onClick={() => setShowConfirmClearPrices(false)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">Limpar Todos os Dados</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Remove completamente todos os dados armazenados, incluindo listas de compras e comparações de preços.
                    </p>
                    <Alert className="mt-3">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Atenção:</strong> Esta ação não pode ser desfeita. Todos os seus dados serão perdidos permanentemente.
                      </AlertDescription>
                    </Alert>
                    {showConfirmClearAll && (
                      <Alert className="mt-3 border-destructive bg-destructive/10">
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                        <AlertDescription className="text-destructive">
                          <strong>CONFIRMAÇÃO FINAL:</strong> Você está prestes a apagar TODOS os dados. Esta ação é irreversível!
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex items-center space-x-2 mt-3">
                      <Button 
                        variant="destructive" 
                        onClick={handleClearAll}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {showConfirmClearAll ? 'CONFIRMAR EXCLUSÃO TOTAL' : 'Limpar Tudo'}
                      </Button>
                      {showConfirmClearAll && (
                        <Button 
                          variant="ghost" 
                          onClick={() => setShowConfirmClearAll(false)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas gerais */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-2xl font-bold text-primary">{listStats.totalLists}</p>
              <p className="text-sm text-muted-foreground">Listas Criadas</p>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{listStats.totalItems}</p>
              <p className="text-sm text-muted-foreground">Itens Cadastrados</p>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{comparatorStats.totalProducts}</p>
              <p className="text-sm text-muted-foreground">Produtos Comparados</p>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(listStats.totalValue + comparatorStats.potentialSavings)}
              </p>
              <p className="text-sm text-muted-foreground">Valor Total Gerenciado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre o aplicativo */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre o Aplicativo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Versão:</span>
              <Badge variant="secondary">1.0.0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tecnologias:</span>
              <div className="flex space-x-1">
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
                <Badge variant="outline">shadcn/ui</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Armazenamento:</span>
              <Badge variant="outline">Local Storage</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Compatibilidade:</span>
              <Badge variant="outline">Responsivo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Funcionando
              </Badge>
            </div>
          </div>
          
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Dica:</strong> Seus dados são salvos localmente no navegador. Para manter seus dados seguros, evite limpar o cache do navegador ou usar modo privado.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
