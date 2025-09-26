import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { Header } from './components/dashboard/Header';
import { PageWrapper } from './components/layout/PageWrapper';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { MovementsPage } from './pages/MovementsPage';


export function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
      {/* TODO: Instalar @tanstack/react-query-devtools para desenvolvimento */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}
