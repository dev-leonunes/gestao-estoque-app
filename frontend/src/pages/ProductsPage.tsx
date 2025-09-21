
import  ProductForm  from './ProductForm';
export function ProductsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Produtos</h2>
                <p className="text-muted-foreground">Gerencie seu inventário de produtos.</p>
            </div>

            {<div>
  <div className="space-y-8">
    <div>
      <h2 className="text-2xl font-bold text-foreground">Produtos</h2>
      <p className="text-muted-foreground">Gerencie seu inventário de produtos.</p>
    </div>
  </div>

  {/* Adicione o formulário aqui! */}
  <ProductForm />

</div>}

        </div>
    );
}
