import { useState } from 'react';
import { useMovements } from '../hooks/useMovements';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Input } from '../components/ui/input';
import { MovementModal } from '../components/modals/MovementModal';
import { PlusCircle, Package, ArrowUp, ArrowDown, Search } from 'lucide-react';
import type { MovementType } from '../types/api';

export function MovementsPage() {
  const { data: movements, isLoading } = useMovements();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<MovementType | 'all'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredMovements = movements?.filter((movement) => {
    const matchesSearch = movement.product?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || movement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getMovementIcon = (type: MovementType) => {
    return type === 'IN' ? (
      <ArrowUp className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-red-600" />
    );
  };

  const getMovementBadge = (type: MovementType) => {
    return type === 'IN' ? (
      <Badge variant="secondary">
        Entrada
      </Badge>
    ) : (
      <Badge variant="destructive">
        Saída
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Movimentações
          </h2>
          <p className="text-muted-foreground">
            Gerencie as movimentações de entrada e saída do estoque.
          </p>
        </div>

        <Button
          onClick={() => setDialogOpen(true)}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Nova Movimentação
        </Button>

        <MovementModal
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-300/50 border-0"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={typeFilter} onValueChange={(value: MovementType | 'all') => setTypeFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="IN">Entradas</SelectItem>
                  <SelectItem value="OUT">Saídas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movements Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Histórico de Movimentações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">Carregando movimentações...</p>
              </div>
            </div>
          ) : filteredMovements && filteredMovements.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMovementIcon(movement.type)}
                        {getMovementBadge(movement.type)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {movement.product?.name || 'Produto não encontrado'}
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${movement.type === 'IN' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {movement.description}
                    </TableCell>
                    <TableCell>
                      {new Date(movement.createdAt).toLocaleString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Nenhuma movimentação encontrada
              </h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || typeFilter !== 'all'
                  ? 'Tente ajustar os filtros para encontrar movimentações.'
                  : 'Crie sua primeira movimentação para começar o controle de estoque.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
