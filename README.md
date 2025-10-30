# Sam Composite E-commerce Platform

A comprehensive, production-ready e-commerce platform for industrial plastic products, featuring a modern React frontend and robust Spring Boot backend.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React + Vite)│◄──►│ (Spring Boot)   │◄──►│   (MySQL)       │
│   Port: 5173    │    │   Port: 8080    │    │   Port: 3306    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **React 18** with Vite for fast development
- **TailwindCSS** for modern, responsive styling
- **Framer Motion** for smooth animations
- **React Router v6** for client-side routing
- **Axios** for API communication
- **Context API** for state management

#### Backend
- **Spring Boot 3.x** with Java 21
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **MySQL 8.0+** for data persistence
- **Maven** for dependency management
- **OpenAPI 3.0** for API documentation

## ✨ Key Features

### E-commerce Functionality
- **Product Catalog**: Browse and search industrial plastic products
- **Advanced Filtering**: Filter by category, grade, thickness, and size
- **Shopping Cart**: Add, update, and manage cart items
- **Quotation System**: Generate quotations for full sheets and cut-to-size products
- **User Management**: Registration, authentication, and profile management
- **Order Processing**: Complete order lifecycle management

### Business Features
- **Dynamic Pricing**: Quantity-based pricing with bulk discounts
- **PDF Export**: Download quotations and invoices as PDF
- **Real-time Search**: Instant product search with debouncing
- **Responsive Design**: Mobile-first design for all devices
- **Admin Dashboard**: Product and order management interface

### Technical Features
- **RESTful APIs**: Well-documented API endpoints
- **JWT Authentication**: Secure user authentication
- **Input Validation**: Comprehensive form validation
- **Error Handling**: User-friendly error messages
- **Performance Optimization**: Code splitting and lazy loading
- **Security**: HTTPS enforcement and security headers

## 🚀 Quick Start

### Prerequisites
- **Java 21** or higher
- **Node.js 18** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher (or use included wrapper)

### 1. Clone Repository
```bash
git clone <repository-url>
cd ProjectDemo
```

### 2. Backend Setup
```bash
cd backend

# Create database
mysql -u root -p -e "CREATE DATABASE plastics_demo;"

# Run setup script
./setup-environment.bat  # Windows
# or
./setup-environment.sh   # Linux/Mac

# Start backend
./mvnw spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **API Documentation**: http://localhost:8080/api/swagger-ui.html

## 🏭 Production Deployment

### Docker Deployment (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up -d

# Check status
docker-compose ps
```

### Traditional Deployment
```bash
# Backend
cd backend
./mvnw clean package -Pprod
java -jar target/plastics-demo-backend-0.0.1-SNAPSHOT.jar

# Frontend
cd frontend
npm run build
# Deploy dist/ folder to web server
```

### Cloud Deployment
- **AWS**: EC2 + RDS + S3 + CloudFront
- **Azure**: App Service + SQL Database + Blob Storage
- **Google Cloud**: Compute Engine + Cloud SQL + Cloud Storage

## 🔧 Configuration

### Environment Variables

#### Backend
```bash
SPRING_PROFILES_ACTIVE=prod
DB_HOST=localhost
DB_PORT=3306
DB_NAME=plastics_demo
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

#### Frontend
```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Professional Plastics
VITE_APP_VERSION=1.0.0
```

## 🔒 Security

### Authentication & Authorization
- **JWT-based authentication** with configurable expiration
- **Role-based access control** (Admin, User, Guest)
- **Password encryption** using BCrypt
- **CORS configuration** for frontend integration

### Security Headers
- **HTTPS enforcement** in production
- **Content Security Policy** (CSP)
- **X-Frame-Options** and **X-Content-Type-Options**
- **Input validation** and sanitization

### Environment Security
- **Environment variables** for sensitive configuration
- **Database connection encryption**
- **API rate limiting** (planned)
- **Audit logging** for security events

## 📊 Monitoring & Logging

### Health Checks
- **Application Health**: `/api/health`
- **Database Health**: `/api/health/db`
- **Disk Space**: `/api/health/disk`

### Logging
- **Structured logging** with JSON format
- **Log rotation** and retention policies
- **Error tracking** and alerting
- **Performance monitoring** with metrics

### Metrics
- **Application metrics** via Spring Boot Actuator
- **Business metrics** for tracking KPIs
- **Performance metrics** for optimization
- **User behavior analytics** (optional)

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Run all tests
./mvnw test

# Run with coverage
./mvnw test jacoco:report

# Run integration tests
./mvnw test -Dtest=*IntegrationTest
```

### Frontend Testing
```bash
cd frontend

# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Test Coverage
- **Unit Tests**: Service and component logic
- **Integration Tests**: API endpoints and database
- **E2E Tests**: Complete user journeys
- **Performance Tests**: Load and stress testing

## 📚 API Documentation

### Swagger UI
- **Development**: http://localhost:8080/api/swagger-ui.html
- **Production**: https://your-domain.com/api/swagger-ui.html

### Key API Endpoints

#### Products
```
GET    /api/products              # Get all products
GET    /api/products/{id}         # Get product by ID
POST   /api/products              # Create new product
PUT    /api/products/{id}         # Update product
DELETE /api/products/{id}         # Delete product
GET    /api/products/search       # Search products
```

#### Cart
```
GET    /api/cart                  # Get cart items
POST   /api/cart                  # Add item to cart
PUT    /api/cart/{id}             # Update cart item
DELETE /api/cart/{id}             # Remove cart item
```

#### Quotations
```
POST   /api/quotations/full-sheets    # Create full sheet quotation
POST   /api/quotations/cut-to-size    # Create cut-to-size quotation
GET    /api/quotations                # Get all quotations
```

#### Authentication
```
POST   /api/auth/register         # User registration
POST   /api/auth/login            # User login
GET    /api/auth/profile          # Get user profile
```

## 🔄 Database Management

### Schema
- **Products**: Product catalog with specifications
- **Categories**: Product categorization
- **Grades**: Material grades and properties
- **Cart**: Shopping cart items
- **Quotations**: Full sheets and cut-to-size quotations
- **Users**: User accounts and authentication

### Migrations
```bash
# Run database migrations
./mvnw flyway:migrate

# Check migration status
./mvnw flyway:info
```

### Backup & Recovery
```bash
# Create backup
mysqldump -u root -p plastics_demo > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
mysql -u root -p plastics_demo < backup_20231201_120000.sql
```

## 🚀 Performance Optimization

### Backend Optimization
- **Connection pooling** with HikariCP
- **Query optimization** with proper indexing
- **Caching** with Redis (optional)
- **JVM tuning** for production

### Frontend Optimization
- **Code splitting** with React.lazy()
- **Tree shaking** to remove unused code
- **Image optimization** with WebP format
- **Bundle analysis** and optimization

### Database Optimization
- **Proper indexing** on frequently queried columns
- **Query optimization** and performance monitoring
- **Connection pooling** and resource management
- **Read replicas** for scaling (planned)

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues
```bash
# Check Java version
java -version

# Check MySQL status
systemctl status mysql

# Check port usage
netstat -tulpn | grep :8080
```

#### Frontend Issues
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run build
```

#### Database Issues
```bash
# Test MySQL connection
mysql -u root -p -e "SELECT 1"

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### Log Analysis
```bash
# Backend logs
tail -f backend/logs/plastics-backend.log

# Frontend build logs
npm run build 2>&1 | tee build.log
```

## 📞 Support & Contributing

### Getting Help
- **Documentation**: Check README files in each directory
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
- **Backend**: Follow Java coding standards and Spring Boot conventions
- **Frontend**: Follow ESLint rules and React best practices
- **Commits**: Use conventional commit messages
- **Documentation**: Update README files for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic e-commerce functionality
- ✅ Product catalog and search
- ✅ Shopping cart and quotations
- ✅ User authentication
- ✅ Responsive design

### Phase 2 (Planned)
- [ ] Advanced search and filtering
- [ ] Payment integration
- [ ] Order management system
- [ ] Email notifications
- [ ] Admin dashboard enhancements

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Microservices architecture

---

**🎉 Production-ready e-commerce platform for industrial plastic products!**

For detailed setup instructions, see:
- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
- [Quick Start Guide](backend/QUICK_START.md)
- [MySQL Setup Guide](backend/INSTALL_MYSQL_GUIDE.md)
