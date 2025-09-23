import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const baseLink = 'block px-4 py-2 rounded-md text-sm font-medium transition hover:bg-blue-50 hover:text-blue-700';
  const activeLink = 'text-blue-600 bg-blue-50';
  const inactiveLink = 'text-gray-700';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 text-gray-900 font-extrabold group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🏭</span>
            <span className="tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Sam Composite
            </span>
          </NavLink>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-4">
            {/* CTA Button - Desktop */}
            <NavLink 
              to="/contact" 
              className="hidden lg:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Get Quote
            </NavLink>

            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                aria-label="Toggle navigation"
                onClick={() => setOpen(v => !v)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className={`h-6 w-6 ${open ? 'hidden' : 'block'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`h-6 w-6 ${open ? 'block' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-1">
              <NavLink end to="/" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Home
              </NavLink>
              <NavLink to="/categories?type=sheet" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Sheets
              </NavLink>
              <NavLink to="/products" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Products
              </NavLink>
              <NavLink to="/add-product" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Add Product
              </NavLink>
              <NavLink to="/cart" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Cart
              </NavLink>
              <NavLink to="/quotations-history" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Quotations History
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Contact
              </NavLink>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden pb-4 border-t border-gray-200 mt-2 pt-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <div className="grid gap-1">
              <NavLink end to="/" onClick={() => setOpen(false)} className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Home
              </NavLink>
              <NavLink to="/categories?type=sheet" onClick={() => setOpen(false)} className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Sheets
              </NavLink>
              <NavLink to="/products" onClick={() => setOpen(false)} className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Products
              </NavLink>
              <NavLink to="/add-product" onClick={() => setOpen(false)} className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Add Product
              </NavLink>
              <NavLink to="/cart" onClick={() => setOpen(false)} className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Cart
              </NavLink>
              <NavLink to="/quotations-history" onClick={() => setOpen(false)} className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Quotations History
              </NavLink>
              <NavLink to="/contact" onClick={() => setOpen(false)} className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}>
                Contact
              </NavLink>
            </div>

            {/* Mobile CTA Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <NavLink 
                to="/contact" 
                onClick={() => setOpen(false)}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                Get Quote
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;


