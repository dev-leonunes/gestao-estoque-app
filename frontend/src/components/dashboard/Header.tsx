// src/components/dashboard/Header.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
          {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
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