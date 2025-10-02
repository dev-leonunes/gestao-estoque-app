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
import { DashboardCard } from '@/components/dashboard/DashboardCard';

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
        <h2 className="text-2xl font-bold text-foreground tracking-tight mb-4">
          Visão Geral
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total de Produtos"
            value={dashboardLoading ? "..." : totalProducts.toString()}
            icon={<Package className="h-4 w-4 text-gray-600" />}
            description="Itens em estoque"
          />

          <DashboardCard
            title="Total Entradas"
            value={dashboardLoading ? "..." : totalQuantityIn.toString()}
            icon={<Package className="h-4 w-4 text-gray-600" />}
            description="Unidades"
          />

          <DashboardCard
            title="Produtos em Baixa"
            value={productsLoading ? "..." : lowStockCount.toString()}
            icon={<PackageX className="h-4 w-4 text-red-600" />}
            description="Requer atenção"
          />

          <DashboardCard
            title="Movimentações Hoje"
            value={dashboardLoading ? "..." : todayMovements.toString()}
            icon={<TrendingUp className="h-4 w-4 text-gray-600" />}
            description="Entradas e saídas"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <div className="flex items-center mb-4">
            <Package className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold">Produtos Recentes</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">Últimos produtos adicionados ao seu estoque</p>
          <div className="rounded-lg border border-gray-100 bg-white">
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
    </div >
  );
}
