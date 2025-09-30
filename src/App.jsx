import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import { Layout } from '@/components/layout/Layout';
import { ShoppingListPage } from '@/pages/ShoppingListPage';
import { PriceComparatorPage } from '@/pages/PriceComparatorPage';
import { ListsManagerPage } from '@/pages/ListsManagerPage';
import { AdminPage } from '@/pages/AdminPage';
import { ThemeProvider } from 'next-themes';
import './App.css';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<ShoppingListPage />} />
              <Route path="/comparador" element={<PriceComparatorPage />} />
              <Route path="/listas" element={<ListsManagerPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
