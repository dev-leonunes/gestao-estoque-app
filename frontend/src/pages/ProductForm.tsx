// Caminho: frontend/src/pages/ProductForm.tsx

import React, { useState } from 'react';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const ProductForm: React.FC = () => {
  // --- A SOLUÇÃO FINAL PARA O ESTILO DA CATEGORIA ESTÁ AQUI ---
  const CategoriaEstilos = `
    [data-radix-select-content] {
      background-color: white !important;
      color: black !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 0.5rem !important;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
      padding: 6px !important;
      z-index: 100 !important; /* Garante que fica por cima de tudo */
    }

    [data-radix-select-item] {
      font-size: 14px !important;
      padding: 10px 10px 10px 32px !important; /* Aumenta a altura de cada item */
      position: relative !important;
      border-radius: 0.25rem !important;
      cursor: pointer !important;
    }

    /* Cor quando o rato passa por cima ou está selecionado */
    [data-radix-select-item][data-highlighted] {
      background-color: #000000 !important; /* Fundo preto */
      color: white !important;
    }

    /* Ícone de "check" */
    [data-radix-select-item-indicator] {
      position: absolute !important;
      left: 8px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
    }
  `;

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newProduct = { name: productName, category, stock, minStock, description };
    console.log('Novo Produto Adicionado:', newProduct);
    alert('Produto adicionado! Verifique a consola do navegador (F12).');
  };

  return (
    // O <></> (Fragment) permite-nos devolver a <style> e o <form> juntos
    <>
      <style>{CategoriaEstilos}</style>
      <form className="grid gap-6 py-4 text-left" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2">
            <div className="space-y-2" style={{ paddingRight: '12px' }}>
                <Label className="text-black font-medium">Nome do Produto <span className="text-red-500">*</span></Label>
                <Input
                    style={{ height: '48px', color: 'black' }}
                    placeholder="Digite o nome do produto"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
            </div>
            <div className="space-y-2" style={{ paddingLeft: '12px' }}>
                <Label className="text-black font-medium">Categoria <span className="text-red-500">*</span></Label>
                <Select onValueChange={setCategory} value={category}>
                    <SelectTrigger style={{ height: '48px', color: 'black' }}>
                        <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="eletronicos">Eletrônicos</SelectItem>
                        <SelectItem value="roupas">Roupas</SelectItem>
                        <SelectItem value="livros">Livros</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <div className="grid grid-cols-2">
            <div className="space-y-2" style={{ paddingRight: '12px' }}>
                <Label className="text-black font-medium">Estoque Atual <span className="text-red-500">*</span></Label>
                <Input
                    style={{ height: '48px', color: 'black' }}
                    type="number"
                    placeholder="0"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    required
                />
            </div>
            <div className="space-y-2" style={{ paddingLeft: '12px' }}>
                <Label className="text-black font-medium">Estoque Mínimo <span className="text-red-500">*</span></Label>
                <Input
                    style={{ height: '48px', color: 'black' }}
                    type="number"
                    placeholder="0"
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    required
                />
            </div>
        </div>
        <div className="space-y-2">
            <Label className="text-black font-medium">Descrição</Label>
            <Textarea
                style={{ color: 'black' }}
                placeholder="Descrição do produto (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
            />
        </div>
        <Button
            style={{ height: '48px' }}
            type="submit"
            className="w-full text-white bg-black hover:bg-gray-800 text-base font-semibold"
        >
            Adicionar Produto
        </Button>
      </form>
    </>
  );
};

export default ProductForm;