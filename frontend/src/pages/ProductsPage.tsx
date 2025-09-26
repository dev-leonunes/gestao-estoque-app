import { useState } from 'react';
import ProductForm from './ProductForm';
import { PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

export function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Produtos
          </h2>
          <p className="text-gray-400">
            Gerencie seu inventário de produtos.
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-white text-black rounded-xl max-w-[650px] w-[90%] shadow-lg p-7 flex flex-col gap-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Adicionar Novo Produto
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Preencha as informações do produto abaixo.
              </DialogDescription>
            </DialogHeader>
            <ProductForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de produtos */}
      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Lista de Produtos</h3>
          {/* TODO: Implementar tabela de produtos com dados da API */}
          <div className="text-center py-8 text-muted-foreground">
            <PlusCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum produto cadastrado ainda.</p>
            <p className="text-sm">Clique em "Adicionar Produto" para começar.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
