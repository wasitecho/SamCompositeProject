# Sam Composite E-commerce Backend

A production-ready Spring Boot 3.x backend service for the Professional Plastics e-commerce platform, built with Java 21 and MySQL 8.0+.

## 🏗️ Architecture

- **Framework**: Spring Boot 3.x with Java 21
- **Database**: MySQL 8.0+ with JPA/Hibernate
- **Security**: Spring Security with JWT authentication
- **API**: RESTful APIs with comprehensive validation
- **Documentation**: OpenAPI 3.0 (Swagger) integration
- **Testing**: JUnit 5 with Mockito and TestContainers

## ✨ Features

### Core Functionality
- **Product Management**: CRUD operations for products, categories, grades
- **Shopping Cart**: Session-based cart with quantity management
- **Quotation System**: Full sheets and cut-to-size quotations
- **User Management**: Registration, authentication, and authorization
- **Order Processing**: Complete order lifecycle management

### Advanced Features
- **Search & Filtering**: Advanced product search with multiple criteria
- **Price Calculation**: Dynamic pricing with discounts and bulk pricing
- **PDF Generation**: Quotation and invoice PDF export
- **File Upload**: Product image and document management
- **Audit Logging**: Comprehensive activity tracking

## 🚀 Quick Start

### Prerequisites
- **Java**: 21 or higher
- **Maven**: 3.6+ or use included Maven wrapper
- **MySQL**: 8.0+ or higher
- **Node.js**: 18+ (for frontend integration)

### Development Setup

1. **Clone and Navigate**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Database Setup**
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE plastics_demo;"
   
   # Run setup script
   ./setup-environment.bat  # Windows
   # or
   ./setup-environment.sh   # Linux/Mac
   ```

3. **Configuration**
   ```bash
   # Copy and configure environment
   cp src/main/resources/application.properties.example src/main/resources/application.properties
   # Edit application.properties with your database credentials
   ```

4. **Run Application**
   ```bash
   # Using Maven wrapper (recommended)
   ./mvnw spring-boot:run
   
   # Or using system Maven
   mvn spring-boot:run
   ```

5. **Verify Installation**
   ```bash
   curl http://localhost:8080/api/health
   # Should return: {"status":"UP"}
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SPRING_PROFILES_ACTIVE` | Active profile | `dev` | No |
| `DB_HOST` | Database host | `localhost` | No |
| `DB_PORT` | Database port | `3306` | No |
| `DB_NAME` | Database name | `plastics_demo` | No |
| `DB_USERNAME` | Database username | `root` | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes (prod) |
| `JWT_EXPIRATION` | JWT expiration time | `86400000` | No |

### Application Properties

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:plastics_demo}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Security Configuration
jwt.secret=${JWT_SECRET:your-secret-key}
jwt.expiration=${JWT_EXPIRATION:86400000}

# Server Configuration
server.port=8080
server.servlet.context-path=/api
```

## 🏭 Production Deployment

### Docker Deployment

1. **Build Docker Image**
   ```bash
   docker build -t plastics-backend:latest .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Health Check**
   ```bash
   curl http://localhost:8080/api/health
   ```

### Traditional Deployment

1. **Build JAR**
   ```bash
   ./mvnw clean package -Pprod
   ```

2. **Run Production JAR**
   ```bash
   java -jar -Dspring.profiles.active=prod target/plastics-demo-backend-0.0.1-SNAPSHOT.jar
   ```

### Cloud Deployment

#### AWS EC2
```bash
# Install Java 21
sudo amazon-linux-extras install java-openjdk21

# Install MySQL
sudo yum install mysql-server

# Deploy application
./deploy-aws.sh
```

#### Azure App Service
```bash
# Deploy using Azure CLI
az webapp deploy --resource-group myResourceGroup --name plastics-backend --src-path target/plastics-demo-backend-0.0.1-SNAPSHOT.jar
```

## 🔒 Security

### Authentication & Authorization
- **JWT-based authentication** with configurable expiration
- **Role-based access control** (Admin, User, Guest)
- **Password encryption** using BCrypt
- **CORS configuration** for frontend integration

### Security Headers
- **HTTPS enforcement** in production
- **Security headers** (X-Frame-Options, X-Content-Type-Options)
- **Input validation** and sanitization
- **SQL injection prevention** via JPA

### Environment Security
```bash
# Generate secure JWT secret
openssl rand -base64 32

# Set secure database password
export DB_PASSWORD=$(openssl rand -base64 16)
```

## 📊 Monitoring & Logging

### Health Checks
- **Application Health**: `/api/health`
- **Database Health**: `/api/health/db`
- **Disk Space**: `/api/health/disk`

### Logging Configuration
```yaml
logging:
  level:
    com.professionalplastics: INFO
    org.springframework.security: WARN
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/plastics-backend.log
```

### Metrics & Monitoring
- **Actuator endpoints** for application metrics
- **Prometheus integration** for monitoring
- **Custom business metrics** for tracking

## 🧪 Testing

### Running Tests
```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=ProductServiceTest

# Run integration tests
./mvnw test -Dtest=*IntegrationTest

# Generate test coverage report
./mvnw test jacoco:report
```

### Test Categories
- **Unit Tests**: Service and repository layer
- **Integration Tests**: API endpoints and database
- **Contract Tests**: API contract validation
- **Performance Tests**: Load and stress testing

## 📚 API Documentation

### Swagger UI
- **Development**: http://localhost:8080/api/swagger-ui.html
- **Production**: https://your-domain.com/api/swagger-ui.html

### API Endpoints

#### Product Management
```
GET    /api/products              # Get all products
GET    /api/products/{id}         # Get product by ID
POST   /api/products              # Create new product
PUT    /api/products/{id}         # Update product
DELETE /api/products/{id}         # Delete product
GET    /api/products/search       # Search products
GET    /api/products/category/{category}  # Get by category
```

#### Cart Management
```
GET    /api/cart                  # Get cart items
POST   /api/cart                  # Add item to cart
PUT    /api/cart/{id}             # Update cart item
DELETE /api/cart/{id}             # Remove cart item
DELETE /api/cart                  # Clear cart
```

#### Quotation System
```
POST   /api/quotations/full-sheets    # Create full sheet quotation
POST   /api/quotations/cut-to-size    # Create cut-to-size quotation
GET    /api/quotations                # Get all quotations
GET    /api/quotations/{id}           # Get quotation by ID
```

#### User Management
```
POST   /api/auth/register         # User registration
POST   /api/auth/login            # User login
GET    /api/auth/profile          # Get user profile
PUT    /api/auth/profile          # Update user profile
```

## 🔄 Database Management

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

### Database Optimization
- **Connection pooling** with HikariCP
- **Query optimization** with proper indexing
- **Caching** with Redis (optional)
- **Read replicas** for scaling

### Application Optimization
- **JVM tuning** for production
- **Garbage collection** optimization
- **Async processing** for heavy operations
- **Response compression** with Gzip

## 🐛 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check MySQL status
systemctl status mysql

# Test connection
mysql -u root -p -e "SELECT 1"
```

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :8080

# Change port in application.properties
server.port=8081
```

#### Memory Issues
```bash
# Increase JVM heap size
java -Xmx2g -jar target/plastics-demo-backend-0.0.1-SNAPSHOT.jar
```

### Log Analysis
```bash
# View application logs
tail -f logs/plastics-backend.log

# Search for errors
grep -i error logs/plastics-backend.log
```

## 📞 Support

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🎉 Ready for production deployment!**

For additional setup guides, see:
- [Quick Start Guide](QUICK_START.md)
- [MySQL Setup Guide](INSTALL_MYSQL_GUIDE.md)
- [Cart Functionality](CART_FUNCTIONALITY.md)
- [Quotation System](QUOTATION_SYSTEM_SETUP_GUIDE.md)
