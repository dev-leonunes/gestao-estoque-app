import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/dashboard/Header';
import { PageWrapper } from './components/layout/PageWrapper';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { MovementsPage } from './pages/MovementsPage';


export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <PageWrapper>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/produtos" element={<ProductsPage />} />
            <Route path="/movimentacoes" element={<MovementsPage />} />
          </Routes>
        </PageWrapper>
      </div>
    </BrowserRouter>
  );
}
