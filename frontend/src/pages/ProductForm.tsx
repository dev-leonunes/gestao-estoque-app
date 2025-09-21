// src/ProductForm.tsx

import React from 'react';
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
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product-name">
          Nome do Produto <span className="text-red-500">*</span>
        </Label>
        <Input id="product-name" placeholder="Digite o nome do produto" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-category">
          Categoria <span className="text-red-500">*</span>
        </Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eletronicos">Eletrônicos</SelectItem>
            <SelectItem value="roupas">Roupas</SelectItem>
            <SelectItem value="livros">Livros</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="stock-atual">
          Estoque Atual <span className="text-red-500">*</span>
        </Label>
        <Input id="stock-atual" type="number" defaultValue="0" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock-minimo">
          Estoque Mínimo <span className="text-red-500">*</span>
        </Label>
        <Input id="stock-minimo" type="number" defaultValue="0" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-description">Descrição</Label>
        <Textarea
          id="product-description"
          placeholder="Descrição do produto (opcional)"
        />
      </div>

      <Button type="submit" className="w-full">
        Adicionar Produto
      </Button>
    </form>
  );
};

export default ProductForm;