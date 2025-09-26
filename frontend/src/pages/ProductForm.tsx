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
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [description, setDescription] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implementar integração com API para criar produto
    const newProduct = { name: productName, category, stock, minStock, description };
    
    // Aqui virá a chamada para a API
    // await createProduct(newProduct);
    
    console.log('Produto a ser criado:', newProduct);
  };

  return (
    <form className="grid gap-6 py-4 text-left" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-black font-medium">Nome do Produto <span className="text-red-500">*</span></Label>
          <Input
            className="h-12 text-black"
            placeholder="Digite o nome do produto"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-black font-medium">Categoria <span className="text-red-500">*</span></Label>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger className="h-12 text-black">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black border border-slate-200 rounded-lg shadow-md p-1.5 z-50">
              {/* TODO: Carregar categorias da API */}
              <SelectItem value="" disabled className="text-sm px-2.5 py-2.5 pl-8 relative rounded cursor-pointer">
                Carregando categorias...
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-black font-medium">Estoque Atual <span className="text-red-500">*</span></Label>
          <Input
            className="h-12 text-black"
            type="number"
            placeholder="0"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label className="text-black font-medium">
            Estoque Mínimo <span className="text-red-500">*</span>
          </Label>
          <Input
            className="h-12 text-black"
            type="number"
            placeholder="0"
            value={minStock}
            onChange={(e) => setMinStock(Number(e.target.value))}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-black font-medium">
          Descrição
        </Label>
        <Textarea
          className="text-black min-h-[100px]"
          placeholder="Descrição do produto (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        className="w-full h-12 text-white bg-black hover:bg-gray-800 text-base font-semibold"
      >
        Adicionar Produto
      </Button>
    </form>
  );
};

export default ProductForm;