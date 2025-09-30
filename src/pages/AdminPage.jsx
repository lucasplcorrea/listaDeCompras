import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Trash2, RefreshCw, Database, AlertTriangle } from 'lucide-react';

export function AdminPage() {
  const { state, dispatch } = useApp();

  const clearAllData = () => {
    if (confirm('Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita e você perderá todas as listas, itens e comparações salvas.')) {
      dispatch({ type: 'CLEAR_ALL_DATA' });
      alert('Todos os dados foram limpos com sucesso!');
    }
  };

  const clearPricesQuantities = () => {
    if (confirm('Tem certeza que deseja limpar apenas os preços e quantidades da lista atual? Os nomes dos itens serão mantidos.')) {
      dispatch({ type: 'CLEAR_PRICES_QUANTITIES' });
      alert('Preços e quantidades foram limpos com sucesso!');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lista-compras-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target.result);
            if (confirm('Tem certeza que deseja importar estes dados? Isso substituirá todos os dados atuais.')) {
              dispatch({ type: 'LOAD_STATE', payload: importedData });
              alert('Dados importados com sucesso!');
            }
          } catch (error) {
            alert('Erro ao importar dados. Verifique se o arquivo é válido.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const getStorageInfo = () => {
    const dataStr = JSON.stringify(state);
    const sizeInBytes = new Blob([dataStr]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    
    return {
      totalLists: Object.keys(state.lists).length,
      totalItems: Object.values(state.lists).reduce((sum, list) => sum + list.items.length, 0),
      totalComparisons: state.priceComparisons.length,
      storageSize: sizeInKB
    };
  };

  const storageInfo = getStorageInfo();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie os dados da aplicação e configurações
        </p>
      </div>

      {/* Storage info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Informações de Armazenamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {storageInfo.totalLists}
              </div>
              <div className="text-sm text-muted-foreground">
                Listas
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {storageInfo.totalItems}
              </div>
              <div className="text-sm text-muted-foreground">
                Itens
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {storageInfo.totalComparisons}
              </div>
              <div className="text-sm text-muted-foreground">
                Comparações
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {storageInfo.storageSize} KB
              </div>
              <div className="text-sm text-muted-foreground">
                Tamanho
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gerenciamento de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Export/Import */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={exportData} variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
            <Button onClick={importData} variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Importar Dados
            </Button>
          </div>

          {/* Clear actions */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-foreground">Ações de Limpeza</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h5 className="font-medium">Limpar Preços e Quantidades</h5>
                  <p className="text-sm text-muted-foreground">
                    Remove apenas os preços e quantidades da lista atual, mantendo os nomes dos itens
                  </p>
                </div>
                <Button onClick={clearPricesQuantities} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <h5 className="font-medium text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Limpar Todos os Dados
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    Remove TODOS os dados: listas, itens, comparações. Esta ação não pode ser desfeita!
                  </p>
                </div>
                <Button onClick={clearAllData} variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Tudo
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App info */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre o Aplicativo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Lista de Compras</strong> - Versão 1.0.0
          </p>
          <p>
            Desenvolvido com React, Tailwind CSS e shadcn/ui
          </p>
          <p>
            Os dados são salvos localmente no seu navegador usando localStorage
          </p>
          <p>
            Para suporte ou sugestões, entre em contato através do GitHub
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
