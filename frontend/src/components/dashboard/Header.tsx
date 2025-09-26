import { NavLink } from 'react-router-dom';

export function Header() {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Gestão de Estoque
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sistema de gerenciamento de produtos e movimentações
          </p>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-primary font-bold' : 'text-muted-foreground transition-colors hover:text-primary'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/produtos"
            className={({ isActive }) =>
              isActive ? 'text-primary font-bold' : 'text-muted-foreground transition-colors hover:text-primary'
            }
          >
            Produtos
          </NavLink>
          <NavLink
            to="/movimentacoes"
            className={({ isActive }) =>
              isActive ? 'text-primary font-bold' : 'text-muted-foreground transition-colors hover:text-primary'
            }
          >
            Movimentações
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
