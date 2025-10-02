import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { useCreateProduct, useUpdateProduct } from '../hooks/useProducts';
import type { Product } from '../types/api';
import { toast } from 'sonner';

interface ProductFormProps {
  onSuccess: () => void;
  product?: Product;
}

export default function ProductForm({ onSuccess, product }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || '');
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity || 0);
  const [minimumStock, setMinimumStock] = useState(product?.minimumStock || 0);
  const [description, setDescription] = useState(product?.description || '');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || '');
      setStockQuantity(product.stockQuantity || 0);
      setMinimumStock(product.minimumStock || 0);
      setDescription(product.description || '');
    }
  }, [product]);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      category: category || undefined,
      stockQuantity,
      minimumStock,
      description: description || undefined,
      isActive: true,
    };

    try {
      if (product?.id) {
        await updateProduct.mutateAsync({ id: product.id, data: payload as any });
        toast.success('Produto atualizado com sucesso!');
      } else {
        await createProduct.mutateAsync(payload as any);
        toast.success('Produto criado com sucesso!');
      }
      onSuccess();
    } catch (err) {
      console.error('Erro ao salvar produto', err);
      toast.error(product?.id ? 'Erro ao atualizar produto' : 'Erro ao criar produto');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto *</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
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
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Estoque Atual *</Label>
          <Input id="stockQuantity" type="number" value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value))} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minimumStock">Estoque Mínimo *</Label>
          <Input id="minimumStock" type="number" value={minimumStock} onChange={(e) => setMinimumStock(Number(e.target.value))} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="destructive"
          onClick={onSuccess}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={createProduct.isPending || updateProduct.isPending}
        >
          {createProduct.isPending || updateProduct.isPending
            ? 'Salvando...'
            : product?.id
              ? 'Atualizar Produto'
              : 'Salvar Produto'
          }
        </Button>
      </div>
    </form>
  );
}
