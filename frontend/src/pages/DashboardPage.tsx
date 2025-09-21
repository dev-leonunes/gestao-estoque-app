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
import { RecentProductItem } from '../components/dashboard/RecentProductItem';

export function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Seção de visão geral com cards */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Visão Geral
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Exemplo de como os cards serão usados */}
          <DashboardCard title="Valor do Estoque" value="R$ 12.580,00" icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
          <DashboardCard title="Produtos Totais" value="150" icon={<Package className="h-4 w-4 text-muted-foreground" />} />
          <DashboardCard title="Itens em Estoque" value="2.350" icon={<PackageCheck className="h-4 w-4 text-muted-foreground" />} />
          <DashboardCard title="Itens em Falta" value="8" icon={<PackageX className="h-4 w-4 text-muted-foreground" />} />
        </div>
      </section>

      {/* Seção de ações rápidas */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <QuickActionButton label="Adicionar Produto" icon={<PlusCircle className="h-4 w-4" />} />
          <QuickActionButton label="Registrar Entrada" icon={<ArrowUpCircle className="h-4 w-4" />} />
          <QuickActionButton label="Registrar Saída" icon={<ArrowDownCircle className="h-4 w-4" />} />
        </div>
      </section>

      {/* Seção de movimentações recentes */}
      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Produtos com Baixo Estoque</h2>
        <div className="rounded-xl border bg-card text-card-foreground">
          <RecentProductItem name="Caneta Esferográfica Azul" quantity={5} />
          <RecentProductItem name="Caderno Universitário 96fls" quantity={2} />
          <RecentProductItem name="Apontador com Depósito" quantity={8} />
          <RecentProductItem name="Borracha Branca" quantity={10} />
        </div>
      </section>
    </div>
  );
}
