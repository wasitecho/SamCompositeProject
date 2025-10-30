import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getCartItems } from '../services/cart';

function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated, isAdmin, isSales } = useAuth();
  const navigate = useNavigate();

  // Cart state for navbar
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await getCartItems();
        if (res.success && Array.isArray(res.data)) {
          setCartCount(res.data.length);
          const total = res.data.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0);
          setCartTotal(total);
        } else {
          setCartCount(0);
          setCartTotal(0);
        }
      } catch (e) {
        setCartCount(0);
        setCartTotal(0);
      }
    };

    loadCart();
  }, [isAuthenticated()]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin()) return '/admin-dashboard';
    if (isSales()) return '/sales-dashboard';
    return '/login';
  };

  const getDashboardText = () => {
    if (isAdmin()) return 'Admin Dashboard';
    if (isSales()) return 'Sales Dashboard';
    return 'Dashboard';
  };

  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const linkVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const mobileMenuVariants = {
    hidden: { 
      opacity: 0,
      x: "100%",
      transition: { duration: 0.3 }
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-lg border-b border-secondary-200 shadow-lg"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <NavLink to="/" className="flex items-center gap-3 text-secondary-900 font-bold group">
              <motion.span 
                className="text-3xl"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                🏭
              </motion.span>
              <span className="text-xl tracking-tight bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 bg-clip-text text-transparent font-extrabold">
                Sam Composite
              </span>
            </NavLink>
          </motion.div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <motion.form 
              onSubmit={handleSearch} 
              className="w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-xl leading-5 bg-white/80 backdrop-blur-sm placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:bg-white"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { to: "/", text: "Home" },
              { to: "/products", text: "Products" },
              // { to: "/sheets", text: "Sheets" },
              { to: "/contact", text: "Contact" }
            ].map((item, index) => (
              <motion.div
                key={item.to}
                variants={linkVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                      isActive
                        ? 'text-primary-600 bg-primary-50 shadow-sm'
                        : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.text}
                      {isActive && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
                          layoutId="activeTab"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated() ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NavLink
                    to="/cart"
                    className="relative px-4 py-2 text-sm font-medium text-secondary-700 bg-secondary-100 rounded-lg hover:bg-secondary-200 transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="relative inline-flex items-center">
                      <i className="fas fa-shopping-cart"></i>
                    </span>
                    <span>Cart</span>
                  </NavLink>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NavLink
                    to={getDashboardLink()}
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {getDashboardText()}
                  </NavLink>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NavLink
                    to="/quotations-history"
                    className="px-4 py-2 text-sm font-medium text-secondary-700 bg-secondary-100 rounded-lg hover:bg-secondary-200 transition-all duration-300"
                  >
                    Quotations
                  </NavLink>
                </motion.div>
                <motion.button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-accent-600 bg-accent-50 rounded-lg hover:bg-accent-100 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-secondary-700 hover:text-primary-600 transition-colors duration-300"
                  >
                    Login
                  </NavLink>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NavLink
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Register
                  </NavLink>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-secondary-700 hover:text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-all duration-300"
              whileTap={{ scale: 0.95 }}
            >
              <motion.svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={open ? { rotate: 180 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </motion.svg>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden fixed inset-0 top-16 z-40"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="bg-white/95 backdrop-blur-lg shadow-2xl border-t border-secondary-200">
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Search */}
                <motion.form 
                  onSubmit={handleSearch}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-secondary-300 rounded-xl bg-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </motion.form>

                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {[
                    { to: "/", text: "Home" },
                    { to: "/products", text: "Products" },
                    // { to: "/sheets", text: "Sheets" },
                    { to: "/contact", text: "Contact" },
                    { to: "/cart", text: "Cart" }
                  ].map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (index + 2) }}
                    >
                      <NavLink
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                            isActive
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-secondary-700 hover:text-primary-600 hover:bg-primary-50'
                          }`
                        }
                      >
                        {item.text}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile User Menu */}
                <div className="pt-4 border-t border-secondary-200">
                  {isAuthenticated() ? (
                    <div className="space-y-2">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <NavLink
                          to={getDashboardLink()}
                          onClick={() => setOpen(false)}
                          className="block px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300"
                        >
                          {getDashboardText()}
                        </NavLink>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <NavLink
                          to="/quotations-history"
                          onClick={() => setOpen(false)}
                          className="block px-4 py-3 text-base font-medium text-secondary-700 bg-secondary-100 rounded-xl hover:bg-secondary-200 transition-all duration-300"
                        >
                          Quotations History
                        </NavLink>
                      </motion.div>
                      <motion.button
                        onClick={() => {
                          handleLogout();
                          setOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-base font-medium text-accent-600 bg-accent-50 rounded-xl hover:bg-accent-100 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                      >
                        Logout
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <NavLink
                          to="/login"
                          onClick={() => setOpen(false)}
                          className="block px-4 py-3 text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300"
                        >
                          Login
                        </NavLink>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <NavLink
                          to="/register"
                          onClick={() => setOpen(false)}
                          className="block px-4 py-3 text-base font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300"
                        >
                          Register
                        </NavLink>
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;