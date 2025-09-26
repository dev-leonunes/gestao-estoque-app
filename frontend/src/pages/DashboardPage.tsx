import {
  ArrowDownCircle,
  ArrowUpCircle,
  DollarSign,
  Package,
  PackageCheck,
  PackageX,
  PlusCircle,
} from 'lucide-react';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import { QuickActionButton } from '../components/dashboard/QuickActionButton';

export function DashboardPage() {
  // TODO: Implementar hooks para buscar dados da API
  // const { data: dashboardStats } = useDashboardStats();
  // const { data: lowStockProducts } = useLowStockProducts();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Visão Geral
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TODO: Substituir por dados reais da API */}
          <DashboardCard title="Valor do Estoque" value="Carregando..." icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
          <DashboardCard title="Produtos Totais" value="Carregando..." icon={<Package className="h-4 w-4 text-muted-foreground" />} />
          <DashboardCard title="Itens em Estoque" value="Carregando..." icon={<PackageCheck className="h-4 w-4 text-muted-foreground" />} />
          <DashboardCard title="Itens em Falta" value="Carregando..." icon={<PackageX className="h-4 w-4 text-muted-foreground" />} />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <QuickActionButton label="Adicionar Produto" icon={<PlusCircle className="h-4 w-4" />} href="/produtos" />
          <QuickActionButton label="Registrar Entrada" icon={<ArrowUpCircle className="h-4 w-4" />} href="/movimentacoes" />
          <QuickActionButton label="Registrar Saída" icon={<ArrowDownCircle className="h-4 w-4" />} href="/movimentacoes" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Produtos com Baixo Estoque</h2>
        <div className="rounded-xl border bg-card text-card-foreground">
          {/* TODO: Mapear produtos com baixo estoque da API */}
          <div className="p-4 text-center text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2" />
            <p>Carregando produtos...</p>
          </div>
        </div>
      </section>
    </div>
  );
}
