import { NavLink } from 'react-router-dom';

export function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Sistema de Estoque
            </h1>
            <p className="text-sm text-gray-600">
              Gerencie seu inventário de forma simples e eficiente
            </p>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive 
                  ? 'text-gray-900 font-semibold border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-600 hover:text-gray-900 transition-colors'
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/produtos"
              className={({ isActive }) =>
                isActive 
                  ? 'text-gray-900 font-semibold border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-600 hover:text-gray-900 transition-colors'
              }
            >
              Produtos
            </NavLink>
            <NavLink
              to="/movimentacoes"
              className={({ isActive }) =>
                isActive 
                  ? 'text-gray-900 font-semibold border-b-2 border-gray-900 pb-1' 
                  : 'text-gray-600 hover:text-gray-900 transition-colors'
              }
            >
              Movimentações
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
