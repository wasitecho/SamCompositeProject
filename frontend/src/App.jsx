import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
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
  return (
    <div className="page-wrapper min-vh-100 d-flex flex-column w-100 h-100">
      {/* Header (sticky, full width) */}
      <Navbar />

      {/* Flexible content area */}
      <main className="content flex-grow-1 d-flex w-100">
        {/* Full-width container to avoid boxed layouts */}
        <div className="container-fluid px-3 px-md-4 py-3 py-md-4 flex-fill">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/grades/:id" element={<GradesPage />} />
            <Route path="/grades" element={<GradesPage />} />
            <Route path="/sheets" element={<SheetsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/quotations-history" element={<QuotationsHistoryPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
      </main>

      {/* Footer (full width at bottom) */}
      <Footer />
    </div>
  );
}

export default App;