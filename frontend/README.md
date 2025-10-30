# Sam Composite E-commerce Frontend

A modern, production-ready React frontend for the Professional Plastics e-commerce platform, built with Vite, TailwindCSS, and Framer Motion.

## 🏗️ Architecture

- **Framework**: React 18 with Vite for fast development and building
- **Styling**: TailwindCSS with custom design system
- **Animations**: Framer Motion for smooth user interactions
- **State Management**: React Context API with custom hooks
- **Routing**: React Router v6 for client-side navigation
- **HTTP Client**: Axios for API communication
- **Build Tool**: Vite with optimized production builds

## ✨ Features

### Core Functionality
- **Product Catalog**: Browse products with advanced filtering and search
- **Product Details**: Detailed product information with specifications
- **Shopping Cart**: Add, update, and manage cart items
- **Quotation System**: Generate and save quotations for full sheets and cut-to-size
- **User Authentication**: Login, registration, and profile management
- **Responsive Design**: Mobile-first design that works on all devices

### Advanced Features
- **Real-time Search**: Instant product search with debouncing
- **Price Calculation**: Dynamic pricing with quantity-based discounts
- **PDF Export**: Download quotations and invoices as PDF
- **Toast Notifications**: User-friendly success and error messages
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: Comprehensive error boundaries and fallbacks

### UI/UX Features
- **Modern Design**: Clean, professional interface with glass-morphism effects
- **Smooth Animations**: 60fps animations with hardware acceleration
- **Dark/Light Mode**: Theme switching capability (planned)
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Performance**: Optimized bundle size with code splitting

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher (comes with Node.js)
- **Backend API**: Professional Plastics backend running on port 8080

### Development Setup

1. **Clone and Navigate**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Edit .env.local with your configuration
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_APP_NAME=Professional Plastics
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   ```
   http://localhost:5173
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api` | Yes |
| `VITE_APP_NAME` | Application name | `Professional Plastics` | No |
| `VITE_APP_VERSION` | Application version | `1.0.0` | No |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | `false` | No |
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics ID | - | No |

## 🏭 Production Deployment

### Build for Production

1. **Create Production Build**
   ```bash
   npm run build
   ```

2. **Preview Production Build**
   ```bash
   npm run preview
   ```

3. **Build Analysis**
   ```bash
   npm run build -- --analyze
   ```

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine as builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and Run**
   ```bash
   docker build -t plastics-frontend:latest .
   docker run -p 80:80 plastics-frontend:latest
   ```

### Cloud Deployment

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### AWS S3 + CloudFront
```bash
# Install AWS CLI and configure
aws configure

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔒 Security

### Content Security Policy
```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' http://localhost:8080;">
```

### Environment Security
- **No sensitive data** in client-side code
- **API keys** stored in environment variables
- **HTTPS enforcement** in production
- **Input sanitization** for user inputs

### Authentication Security
- **JWT token storage** in httpOnly cookies (recommended)
- **Token refresh** mechanism
- **Automatic logout** on token expiration
- **Secure API communication** with HTTPS

## 📊 Performance Optimization

### Bundle Optimization
- **Code splitting** with React.lazy()
- **Tree shaking** to remove unused code
- **Image optimization** with WebP format
- **Gzip compression** for static assets

### Runtime Performance
- **React.memo()** for component memoization
- **useMemo()** and **useCallback()** for expensive operations
- **Virtual scrolling** for large lists
- **Debounced search** to reduce API calls

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Testing Strategy
- **Unit Tests**: Component logic and utilities
- **Integration Tests**: API integration and user flows
- **E2E Tests**: Complete user journeys
- **Visual Tests**: UI component regression testing

## 📱 Responsive Design

### Breakpoint System
```css
/* TailwindCSS breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Mobile-First Approach
- **Touch-friendly** interface elements
- **Optimized navigation** for mobile devices
- **Responsive images** with proper sizing
- **Fast loading** on slow connections

## 🎨 Design System

### Color Palette
```css
:root {
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-900: #1e3a8a;
  
  --secondary-50: #f9fafb;
  --secondary-500: #6b7280;
  --secondary-900: #111827;
  
  --accent-500: #ef4444;
  --success-500: #10b981;
  --warning-500: #f59e0b;
}
```

### Typography
```css
/* Font families */
font-sans: 'Inter', system-ui, sans-serif;
font-mono: 'JetBrains Mono', monospace;

/* Font sizes */
text-xs: 0.75rem;    /* 12px */
text-sm: 0.875rem;   /* 14px */
text-base: 1rem;     /* 16px */
text-lg: 1.125rem;   /* 18px */
text-xl: 1.25rem;    /* 20px */
```

## 🔄 State Management

### Context Structure
```javascript
// AuthContext.jsx
export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false
})

// CartContext.jsx
export const CartContext = createContext({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {}
})
```

### Custom Hooks
```javascript
// useAuth.js
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// useCart.js
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
```

## 📚 API Integration

### API Service Structure
```javascript
// services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Service Modules
```javascript
// services/products.js
export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  search: (query) => api.get(`/products/search?q=${query}`),
  getByCategory: (category) => api.get(`/products/category/${category}`)
}

// services/cart.js
export const cartService = {
  getItems: () => api.get('/cart'),
  addItem: (item) => api.post('/cart', item),
  updateItem: (id, updates) => api.put(`/cart/${id}`, updates),
  removeItem: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart')
}
```

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run build
```

#### API Connection Issues
```bash
# Check if backend is running
curl http://localhost:8080/api/health

# Check CORS configuration
# Ensure backend allows requests from http://localhost:5173
```

#### Performance Issues
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for memory leaks
# Use React DevTools Profiler
```

### Debug Tools
- **React DevTools**: Component inspection and profiling
- **Redux DevTools**: State management debugging
- **Network Tab**: API request/response inspection
- **Console**: Error logging and debugging

## 📞 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Use Prettier for code formatting
- **Conventional Commits**: Use conventional commit messages
- **Component Structure**: Follow the established component patterns

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🎉 Ready for production deployment!**

For additional information, see:
- [Backend Documentation](../backend/README.md)
- [UI Upgrade Summary](UPGRADE_SUMMARY.md)
- [Component Documentation](./src/components/README.md)
