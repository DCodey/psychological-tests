import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import PsycheLogo from '../Icons/PsycheLogo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y menú móvil */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <Link to="/" className="flex items-center">
                <PsycheLogo className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-indigo-600 hidden sm:inline">
                  PsicoTest
                </span>
              </Link>
            </div>

            {/* Navegación desktop */}
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
              >
                Inicio
              </Link>
              <Link
                to="/acerca-de"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
              >
                Acerca de
              </Link>
            </nav>
          </div>

          {/* Perfil y menú móvil */}
          <div className="flex items-center">
            <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              <div className="relative">
                <Link 
                  to="/psychologist"
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Ir al panel del psicólogo</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <User className="h-5 w-5" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Botón de menú móvil */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menú principal</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Inicio
            </Link>
            <Link
              to="/acerca-de"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Acerca de
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">            
            <div className="mt-3 space-y-1">
              <Link 
                to="/psychologist"
                className="flex items-center px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                <User className="h-5 w-5 mr-3" />
                Panel del Psicólogo
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
