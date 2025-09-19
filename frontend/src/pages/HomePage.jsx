import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

function HomePage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

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
                Industrial Plastics Solutions
              </h1>
              <p className="text-blue-100/90 text-lg lg:text-xl mb-8 max-w-2xl leading-relaxed">
                Professional-grade plastics for manufacturing, construction, and industrial applications. 
                Quality materials, reliable service, exceptional results.
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
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Categories</h2>
            <p className="text-gray-600">Explore our comprehensive range of industrial plastic materials</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div onClick={() => navigate('/categories')} className="cursor-pointer">
              <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-6 text-center">
                <div className="text-4xl mb-3">📋</div>
                <h5 className="text-lg font-semibold">Sheets</h5>
                <p className="text-gray-600 text-sm">High-quality plastic sheets for cutting, machining, and fabrication</p>
              </div>
            </div>
            <div>
              <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-6 text-center">
                <div className="text-4xl mb-3">🔩</div>
                <h5 className="text-lg font-semibold">Rods</h5>
                <p className="text-gray-600 text-sm">Precision-machined plastic rods for industrial applications</p>
              </div>
            </div>
            <div>
              <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-6 text-center">
                <div className="text-4xl mb-3">🔧</div>
                <h5 className="text-lg font-semibold">Tubing</h5>
                <p className="text-gray-600 text-sm">Durable plastic tubing for fluid handling and protection</p>
              </div>
            </div>
            <div>
              <div className="h-full rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition p-6 text-center">
                <div className="text-4xl mb-3">📄</div>
                <h5 className="text-lg font-semibold">Films</h5>
                <p className="text-gray-600 text-sm">Protective films and membranes for specialized applications</p>
              </div>
            </div>
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


