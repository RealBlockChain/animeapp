import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Anime App
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="hover:text-blue-200">
              Inicio
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
