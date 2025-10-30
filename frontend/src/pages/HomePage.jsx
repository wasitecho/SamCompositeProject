import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';

function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (e) {
      // silent fail for demo
    }
  };

  useEffect(() => {
    // Prefetch categories so we have data before hover
    fetchCategories();
  }, []);

  const handleSheetsClick = () => {
    if (!isAuthenticated()) {
      alert('Please login to access the Sheets section.');
      return;
    }
    navigate('/categories?type=sheet');
  };



  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-cyan-500/20 rounded-full blur-lg animate-pulse delay-500"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-6">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                Trusted by 500+ Companies
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              The Backbone For Those Who
              Build The World
              </h1>
              <p className="text-blue-100/90 text-lg lg:text-xl mb-8 max-w-2xl leading-relaxed">
                   We are the leading manufactures of advanced composites for the world builders for the last 30 years
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  Browse Products
                  <span className="text-xl">→</span>
                </Link>
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm">
                  Get Quote
                  <span className="text-lg">📞</span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 text-center lg:text-right">
              <div className="relative">
                <div className="text-8xl lg:text-9xl mb-4 transform hover:scale-110 transition-transform duration-500">🏭</div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-bounce delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Featured Categories
            </h2>
            <p className="text-gray-600 mt-2 text-lg">Explore our comprehensive range of industrial plastic materials</p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Sheets Card */}
            <motion.div 
              onClick={handleSheetsClick} 
              className="cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="h-full rounded-2xl border-2 border-transparent bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center relative overflow-hidden"
                whileHover={{ 
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  borderColor: "#3b82f6"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="text-5xl mb-4 relative z-10"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  📋
                </motion.div>
                <motion.h5 
                  className="text-xl font-bold mb-3 relative z-10 group-hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  Sheets
                </motion.h5>
                <motion.p 
                  className="text-gray-600 text-sm group-hover:text-blue-100 transition-colors duration-300 relative z-10"
                  whileHover={{ scale: 1.02 }}
                >
                  High-quality plastic sheets for cutting, machining, and fabrication
                </motion.p>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </motion.div>
            </motion.div>

            {/* Rods Card */}
            <motion.div 
              className="cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="h-full rounded-2xl border-2 border-transparent bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center relative overflow-hidden"
                whileHover={{ 
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  borderColor: "#10b981"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="text-5xl mb-4 relative z-10"
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  🔩
                </motion.div>
                <motion.h5 
                  className="text-xl font-bold mb-3 relative z-10 group-hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  Rods
                </motion.h5>
                <motion.p 
                  className="text-gray-600 text-sm group-hover:text-green-100 transition-colors duration-300 relative z-10"
                  whileHover={{ scale: 1.02 }}
                >
                  Precision-machined plastic rods for industrial applications
                </motion.p>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </motion.div>
            </motion.div>

            {/* Tubing Card */}
            <motion.div 
              className="cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="h-full rounded-2xl border-2 border-transparent bg-gradient-to-br from-orange-50 to-red-100 shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center relative overflow-hidden"
                whileHover={{ 
                  background: "linear-gradient(135deg, #f97316, #dc2626)",
                  borderColor: "#f97316"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="text-5xl mb-4 relative z-10"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  🔧
                </motion.div>
                <motion.h5 
                  className="text-xl font-bold mb-3 relative z-10 group-hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  Tubing
                </motion.h5>
                <motion.p 
                  className="text-gray-600 text-sm group-hover:text-orange-100 transition-colors duration-300 relative z-10"
                  whileHover={{ scale: 1.02 }}
                >
                  Durable plastic tubing for fluid handling and protection
                </motion.p>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </motion.div>
            </motion.div>

            {/* Films Card */}
            <motion.div 
              className="cursor-pointer group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="h-full rounded-2xl border-2 border-transparent bg-gradient-to-br from-purple-50 to-pink-100 shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center relative overflow-hidden"
                whileHover={{ 
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  borderColor: "#8b5cf6"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <motion.div 
                  className="text-5xl mb-4 relative z-10"
                  whileHover={{ scale: 1.2, rotate: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  📄
                </motion.div>
                <motion.h5 
                  className="text-xl font-bold mb-3 relative z-10 group-hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  Films
                </motion.h5>
                <motion.p 
                  className="text-gray-600 text-sm group-hover:text-purple-100 transition-colors duration-300 relative z-10"
                  whileHover={{ scale: 1.02 }}
                >
                  Protective films and membranes for specialized applications
                </motion.p>
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Why Choose Professional Plastics?</h2>
            <p className="text-gray-600">Industry-leading solutions backed by decades of experience</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="text-4xl mb-3">⚡</div>
              <h5 className="font-semibold">Fast Delivery</h5>
              <p className="text-gray-600 text-sm">Quick turnaround times to keep your projects on schedule</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="text-4xl mb-3">🎯</div>
              <h5 className="font-semibold">Quality Assurance</h5>
              <p className="text-gray-600 text-sm">Rigorous testing ensures every product meets industry standards</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="text-4xl mb-3">📦</div>
              <h5 className="font-semibold">Wide Range</h5>
              <p className="text-gray-600 text-sm">Comprehensive inventory covering all industrial plastic needs</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="text-4xl mb-3">🤝</div>
              <h5 className="font-semibold">Expert Support</h5>
              <p className="text-gray-600 text-sm">Technical expertise to help you select the right materials</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;


