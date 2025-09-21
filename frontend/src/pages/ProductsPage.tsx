// src/pages/ProductsPage.tsx

import React, { useState } from 'react';
import ProductForm from './ProductForm'; // O seu formulário
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'; // Os componentes de Diálogo do seu projeto

export function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Container que alinha o título da página e o botão */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Produtos</h2>
          <p className="text-muted-foreground">Gerencie seu inventário de produtos.</p>
        </div>

        {/* Botão para abrir o diálogo */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3">
              + Adicionar Produto
            </button>
          </DialogTrigger>

          {/* Conteúdo da janela de diálogo */}
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Produto</DialogTitle>
              <DialogDescription>
                Preencha as informações do produto abaixo.
              </DialogDescription>
            </DialogHeader>
            <ProductForm /> {/* O seu formulário está aqui */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Remova o componente ProductForm que estava aqui antes */}

    </div>
  );
}