import { useState } from 'react';
import {
  Package,
  PackageX,
  TrendingUp,
  ShoppingCart,
  Plus,
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { useProducts } from '../hooks/useProducts';
import { QuickActionButton } from '../components/dashboard/QuickActionButton';
import { QuickActionModalButton } from '../components/dashboard/QuickActionModalButton';
import { RecentProductItem } from '../components/dashboard/RecentProductItem';
import { ProductModal } from '../components/modals/ProductModal';

export function DashboardPage() {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboard();
  const { data: products, isLoading: productsLoading } = useProducts();

  const totalProducts = dashboardData?.totalProducts || 0;
  const totalQuantityIn = dashboardData?.movementsSummary?.totalQuantityIn || 0;

  const lowStockCount = products?.filter(product =>
    product.stockQuantity <= product.minimumStock
  ).length || 0;

  const todayMovements = dashboardData?.recentMovements?.filter(
    movement => {
      const today = new Date().toDateString();
      return new Date(movement.createdAt).toDateString() === today;
    }
  ).length || 0;

  const recentProducts = products?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Visão Geral
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Package className="h-4 w-4 text-gray-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-600">Total de Produtos</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">
                {dashboardLoading ? "..." : totalProducts}
              </p>
              <p className="text-sm text-gray-500">Itens em estoque</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <Package className="h-4 w-4 text-gray-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-600">Total Entradas</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">
                {dashboardLoading ? "..." : totalQuantityIn}
              </p>
              <p className="text-sm text-gray-500">Unidades</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <PackageX className="h-4 w-4 text-red-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-600">Produtos em Baixa</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">
                {productsLoading ? "..." : lowStockCount}
              </p>
              <p className="text-sm text-gray-500">Requer atenção</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-gray-600 mr-2" />
              <h3 className="text-sm font-medium text-gray-600">Movimentações Hoje</h3>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold">
                {dashboardLoading ? "..." : todayMovements}
              </p>
              <p className="text-sm text-gray-500">Entradas e saídas</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="flex items-center mb-4">
            <Package className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold">Produtos Recentes</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">Últimos produtos adicionados ao seu estoque</p>
          <div className="rounded-lg border border-gray-200 bg-white">
            {productsLoading ? (
              <div className="p-4 text-center text-gray-500">
                <Package className="h-8 w-8 mx-auto mb-2" />
                <p>Carregando produtos...</p>
              </div>
            ) : recentProducts.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentProducts.map((product) => (
                  <RecentProductItem
                    key={product.id}
                    productName={product.name}
                    category={product.category || 'Sem categoria'}
                    stock={product.stockQuantity}
                    status={
                      product.stockQuantity === 0 ? 'crítico' :
                        product.stockQuantity <= product.minimumStock ? 'baixo' : 'normal'
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Package className="h-8 w-8 mx-auto mb-2" />
                <p>Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
          <p className="text-gray-500 text-sm mb-4">Acesso rápido às principais funcionalidades</p>
          <div className="space-y-1">
            <QuickActionButton
              label="Gerenciar Produtos"
              icon={<Package className="h-4 w-4" />}
              href="/produtos"
            />
            <QuickActionModalButton
              label="Adicionar Produto"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => setIsProductModalOpen(true)}
            />
            <QuickActionButton
              label="Movimentações"
              icon={<ShoppingCart className="h-4 w-4" />}
              href="/movimentacoes"
            />
          </div>

          <ProductModal 
            isOpen={isProductModalOpen} 
            onClose={() => setIsProductModalOpen(false)}
          />
        </section>
      </div>
    </div>
  );
}
