import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Button } from '../ui/button';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/produtos', label: 'Produtos' },
    { to: '/movimentacoes', label: 'Movimentações' }
  ];

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl sm:text-[3.2rem] font-bold text-gray-900">
              Sistema de Estoque
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
              Gerencie seu inventário de forma simples e eficiente
            </p>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? 'text-gray-900 font-semibold border-b-2 border-gray-900 pb-1'
                    : 'text-gray-600 hover:text-gray-900 transition-colors'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden p-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6">
                <div className="flex flex-col space-y-3">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        isActive
                          ? 'text-black font-semibold px-3 py-2 rounded-md bg-gray-100'
                          : 'text-black px-3 py-2 rounded-md hover:bg-gray-50'
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
