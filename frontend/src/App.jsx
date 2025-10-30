import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import SalesDashboard from './pages/SalesDashboard';
import GradesPage from './pages/GradesPage';
import ProductsPage from './pages/ProductsPage';
import AddProductPage from './pages/AddProductPage';
import ContactPage from './pages/ContactPage';
import SheetsPage from './pages/SheetsPage';
import CategoryPage from './pages/CategoryPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import QuotationsHistoryPage from './pages/QuotationsHistoryPage';

function App() {
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-secondary-50">
        {/* Header */}
        <Navbar />

        {/* Main Content */}
        <motion.main 
          className="flex-1"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/grades/:id" element={<GradesPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/sheets" element={<SheetsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/sales-dashboard" 
              element={
                <ProtectedRoute requireSales={true}>
                  <SalesDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-product" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AddProductPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quotations-history" 
              element={
                <ProtectedRoute>
                  <QuotationsHistoryPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </motion.main>

        {/* Footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;