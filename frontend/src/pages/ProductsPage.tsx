import { useState } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { ProductModal } from '../components/modals/ProductModal';
import { ConfirmationModal } from '../components/modals/ConfirmationModal';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { toast } from 'sonner';

export function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products, isLoading } = useProducts({
    category: categoryFilter === 'all' ? undefined : categoryFilter
  });

  const deleteProduct = useDeleteProduct();

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteProduct.mutateAsync(productToDelete);
        toast.success('Produto excluído com sucesso!');
        setProductToDelete(null);
      } catch (e) {
        console.error('Erro ao deletar produto', e);
        toast.error('Erro ao excluir produto. Tente novamente.');
      }
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStockStatus = (product: any) => {
    if (product.stockQuantity === 0) return { label: 'Esgotado', variant: 'destructive' as const };
    if (product.stockQuantity <= product.minimumStock) return { label: 'Baixo', variant: 'secondary' as const };
    return { label: 'Normal', variant: 'default' as const };
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
          <p className="text-gray-600">Gerencie seu inventário de produtos</p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>

        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
          product={editingProduct}
        />
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            <SelectItem value="Tecidos e Malhas">Tecidos e Malhas</SelectItem>
            <SelectItem value="Aviamentos">Aviamentos</SelectItem>
            <SelectItem value="Linhas e Fios">Linhas e Fios</SelectItem>
            <SelectItem value="Agulhas e Alfinetes">Agulhas e Alfinetes</SelectItem>
            <SelectItem value="Ferramentas e Acessórios">Ferramentas e Acessórios</SelectItem>
            <SelectItem value="Modelagem e Marcação">Modelagem e Marcação</SelectItem>
            <SelectItem value="Máquinas e Peças">Máquinas e Peças</SelectItem>
            <SelectItem value="Estrutura e Enchimento">Estrutura e Enchimento</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de Produtos */}
      <div className="rounded-lg border border-gray-100 bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Lista de Produtos</h3>
            <span className="text-sm text-muted-foreground">
              {(filteredProducts?.length ?? 0)} produto(s) encontrado(s)
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Carregando produtos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <PlusCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum produto encontrado.</p>
              {!searchTerm && !categoryFilter && (
                <p className="text-sm">Clique em "Adicionar Produto" para começar.</p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.description && (
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                          {product.category || 'Sem categoria'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{product.stockQuantity} unidades</p>
                        <p className="text-sm text-muted-foreground">
                          Mín: {product.minimumStock}
                        </p>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${status.variant === 'destructive'
                          ? 'bg-red-100 text-red-800'
                          : status.variant === 'secondary'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                          }`}>
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setProductToDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}
