// src/components/ProductForm.tsx

import React from 'react';

const ProductForm: React.FC = () => {
  return (
    <div className="p-6 bg-card rounded-lg shadow-md max-w-md mx-auto my-10">
      <h2 className="text-2xl font-bold text-foreground mb-6">Adicionar Produto</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1" htmlFor="product-name">
            Nome do Produto
          </label>
          <input
            type="text"
            id="product-name"
            className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-input"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-1" htmlFor="product-description">
            Descrição
          </label>
          <textarea
            id="product-description"
            rows={3}
            className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-input"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-1" htmlFor="product-price">
            Preço
          </label>
          <input
            type="number"
            id="product-price"
            className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-input"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md font-semibold hover:bg-primary/80 transition-colors"
        >
          Adicionar Produto
        </button>
      </form>
    </div>
  );
};

export default ProductForm;


