import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-xl font-bold text-foreground">Sistema de Estoque</h1>
        </Link>
        <nav className="flex items-center gap-3">
          {/* TODO: Adicionar botões/links de navegação aqui se necessário */}
        </nav>
      </div>
    </header>
  );
}
