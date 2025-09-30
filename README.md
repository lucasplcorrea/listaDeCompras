# Lista de Compras - Mercado

Um aplicativo web moderno e responsivo para gerenciar listas de compras, desenvolvido com React, Tailwind CSS e shadcn/ui.

## 🚀 Funcionalidades

### 📝 Lista de Compras
- Adicione itens com nome, quantidade, preço e categoria
- Edite e remova itens facilmente com formulários intuitivos
- Marque itens como concluídos
- Visualize o total de itens e valor da compra em tempo real
- **Novo**: Organização automática por categorias com ícones coloridos
- **Novo**: Labels claras e intuitivas em todos os formulários

### 🎨 Temas e Interface
- **Novo**: Tema claro e escuro com alternância suave
- **Novo**: Paleta de cores inspirada no iFood (tons vermelhos)
- **Novo**: Ícones coloridos e consistentes
- Interface moderna e responsiva
- Design otimizado para mobile, tablet e desktop

### 🏷️ Sistema de Categorização
- **Novo**: 11 categorias pré-definidas (Alimentos Básicos, Laticínios, Carnes, etc.)
- **Novo**: Agrupamento visual automático por categoria
- **Novo**: Tags de categoria nos itens
- **Novo**: Seleção fácil de categoria ao adicionar itens

### 🔍 Comparador de Preços
- Compare produtos por preço unitário (kg, L, g, ml, etc.)
- Identifique automaticamente o melhor custo-benefício
- Salve comparações para consulta posterior
- Suporte a diferentes unidades de medida

### 📂 Gerenciamento de Listas
- Crie múltiplas listas de compras
- Alterne facilmente entre listas
- Visualize estatísticas de cada lista
- Organize suas compras por categoria ou ocasião

### ⚙️ Configurações e Dados
- Exporte/importe seus dados
- Limpe dados seletivamente ou completamente
- Visualize estatísticas de armazenamento
- Dados salvos automaticamente no navegador

## 🎨 Design e UX

- **Interface Moderna**: Design limpo e profissional com Tailwind CSS
- **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Navegação Intuitiva**: Sidebar para desktop e navegação inferior para mobile
- **Componentes Polidos**: Utiliza shadcn/ui para uma experiência consistente
- **Ícones Consistentes**: Lucide React para iconografia moderna

## 🛠️ Tecnologias

- **Frontend**: React 19 com Vite
- **Estilização**: Tailwind CSS 4
- **Componentes**: shadcn/ui
- **Roteamento**: React Router DOM
- **Ícones**: Lucide React
- **Persistência**: localStorage
- **Deploy**: Vercel

## 🚀 Como Usar

### Desenvolvimento Local

1. Clone o repositório
2. Instale as dependências:
   ```bash
   pnpm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm run dev
   ```
4. Acesse `http://localhost:5173`

### Build para Produção

```bash
pnpm run build
```

### Deploy na Vercel

1. Conecte seu repositório à Vercel
2. Configure o build command: `pnpm run build`
3. Configure o output directory: `dist`
4. Deploy automático a cada push

## 📱 Responsividade

O aplicativo foi desenvolvido com design mobile-first:

- **Desktop (1024px+)**: Sidebar fixa à esquerda com navegação completa
- **Tablet (768px-1023px)**: Sidebar retrátil com botão de menu
- **Mobile (até 767px)**: Menu lateral oculto + navegação inferior

## 💾 Persistência de Dados

Todos os dados são salvos automaticamente no localStorage do navegador:

- Listas de compras e itens
- Comparações de preços salvas
- Configurações do usuário
- Estado da aplicação

## 🔧 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── layout/         # Componentes de layout
│   └── ui/             # Componentes shadcn/ui
├── contexts/           # Contextos React
├── pages/              # Páginas da aplicação
├── App.jsx             # Componente raiz
└── main.jsx            # Ponto de entrada
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

Desenvolvido com ❤️ usando React e Tailwind CSS
