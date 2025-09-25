import React, { useState } from 'react';
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
          <h2 className="text-2xl font-bold text-white">Produtos</h2>
          <p className="text-gray-400">Gerencie seu inventário de produtos.</p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </DialogTrigger>

          <DialogContent
            style={{
              backgroundColor: 'white',
              color: 'black',
              borderRadius: '0.75rem',
              maxWidth: '650px',
              width: '90%',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              
              // --- AJUSTES DE ESTILO AQUI ---
              padding: '28px', // Aumenta o espaçamento interno geral
              display: 'flex',
              flexDirection: 'column',
              gap: '24px', // Aumenta o espaço entre o cabeçalho e o formulário
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Adicionar Novo Produto</DialogTitle>
              <DialogDescription className="text-gray-500">
                Preencha as informações do produto abaixo.
              </DialogDescription>
            </DialogHeader>
            <ProductForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Sua solução para o fundo escuro (mantida) */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 40,
          }}
          onClick={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
