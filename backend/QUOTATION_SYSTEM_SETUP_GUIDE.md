# 🚀 Quotation System Setup Guide

This guide will help you set up the complete quotation system for the Professional Plastics E-commerce Demo.

## 📋 Overview

The quotation system includes:
- **Full Sheets Quotations**: For standard sheet products
- **Cut-to-Size Quotations**: For custom cut products with machining calculations
- **Quotations History**: View and download saved quotations as PDF
- **PDF Export**: Download quotations as PDF files

## 🗄️ Database Setup

### 1. Create Quotation Tables

Run the SQL script to create the required tables:

```bash
# Windows
setup-quotation-tables.bat

# Or manually with MySQL
mysql -u root -p plastics_demo < create-quotation-tables.sql
```

### 2. Tables Created

- `full_sheets_quotation`: Stores full sheet quotations
- `cut_to_size_quotation`: Stores cut-to-size quotations

Both tables include proper foreign key relationships with existing tables.

## 🔧 Backend Implementation

### Entities Created
- `FullSheetsQuotation.java`: Entity for full sheet quotations
- `CutToSizeQuotation.java`: Entity for cut-to-size quotations

### DTOs Created
- `FullSheetsQuotationRequest.java`: Request DTO for creating full sheet quotations
- `CutToSizeQuotationRequest.java`: Request DTO for creating cut-to-size quotations
- `FullSheetsQuotationResponse.java`: Response DTO for full sheet quotations
- `CutToSizeQuotationResponse.java`: Response DTO for cut-to-size quotations

### Repositories Created
- `FullSheetsQuotationRepository.java`: Repository for full sheet quotations
- `CutToSizeQuotationRepository.java`: Repository for cut-to-size quotations

### Controller Created
- `QuotationController.java`: REST API endpoints for quotations

## 🌐 API Endpoints

### Full Sheets Quotations
- `POST /api/quotations/full-sheets` - Create new full sheet quotation
- `GET /api/quotations/full-sheets` - Get all full sheet quotations

### Cut-to-Size Quotations
- `POST /api/quotations/cut-to-size` - Create new cut-to-size quotation
- `GET /api/quotations/cut-to-size` - Get all cut-to-size quotations

### Generic
- `GET /api/quotations/{id}` - Get quotation by ID (works for both types)

## 🎨 Frontend Implementation

### Pages Created
- `QuotationsHistoryPage.jsx`: View and download quotations

### Services Created
- `quotations.js`: API service for quotation operations

### Features Added
- **Navbar**: Added "Quotations History" link
- **ProductDetailsPage**: Added "Save Quotation" buttons for both tabs
- **PDF Export**: Download quotations as PDF using jsPDF

## 📱 Frontend Features

### ProductDetailsPage Enhancements
1. **Full Sheets Tab**:
   - Get Quotation button (existing)
   - Add to Cart button (existing)
   - **Save Quotation button** (NEW)

2. **Cut-to-Size Tab**:
   - Get Quotation button (existing)
   - Add to Cart button (existing)
   - **Save Quotation button** (NEW)

### QuotationsHistoryPage Features
1. **Two Tabs**:
   - Full Sheets Quotations
   - Cut-to-Size Quotations

2. **Table Display**:
   - All quotation fields
   - Formatted dates and currency
   - Grade information

3. **PDF Export**:
   - Download individual quotations as PDF
   - Includes all relevant details

## 🔄 Workflow

### Saving a Quotation
1. Navigate to Product Details page
2. Select product specifications (series, thickness, size)
3. Enter quantity and other required fields
4. Click "Save Quotation" button
5. Quotation is saved to database
6. Success message displayed with quotation ID

### Viewing Quotations
1. Click "Quotations History" in navbar
2. Switch between Full Sheets and Cut-to-Size tabs
3. View all saved quotations in table format
4. Download individual quotations as PDF

## 📦 Dependencies

### Backend
- Spring Boot 3.x
- Spring Data JPA
- MySQL Connector
- Validation API

### Frontend
- React 18
- jsPDF (for PDF generation)
- Axios (for API calls)
- React Router v6

## 🚀 Getting Started

### 1. Database Setup
```bash
cd backend
setup-quotation-tables.bat
```

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Install jsPDF (if not already installed)
```bash
cd frontend
npm install jspdf
```

## 🧪 Testing

### Test Full Sheets Quotation
1. Go to any product details page
2. Select Full Sheets tab
3. Fill in all required fields
4. Click "Save Quotation"
5. Check Quotations History page

### Test Cut-to-Size Quotation
1. Go to any product details page
2. Select Cut-to-Size tab
3. Fill in all required fields including cut dimensions
4. Click "Save Quotation"
5. Check Quotations History page

### Test PDF Export
1. Go to Quotations History page
2. Click "Download PDF" for any quotation
3. Verify PDF contains all quotation details

## 🔧 Configuration

### Database Configuration
Update `application.properties` if needed:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/plastics_demo
spring.datasource.username=root
spring.datasource.password=your_password
```

### CORS Configuration
The QuotationController includes CORS configuration for `http://localhost:5173`.

## 📝 Notes

- All quotations include timestamps
- Foreign key relationships ensure data integrity
- PDF export includes all relevant quotation details
- Form validation prevents invalid quotations
- Success/error messages provide user feedback

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials
   - Verify database exists

2. **CORS Issues**
   - Check backend CORS configuration
   - Ensure frontend URL matches CORS settings

3. **PDF Export Not Working**
   - Ensure jsPDF is installed: `npm install jspdf`
   - Check browser console for errors

4. **Quotation Not Saving**
   - Check all required fields are filled
   - Verify product configuration exists
   - Check backend logs for errors

## 📞 Support

If you encounter any issues:
1. Check the console logs (both browser and backend)
2. Verify all dependencies are installed
3. Ensure database tables are created
4. Check API endpoints are accessible

---

**🎉 Your quotation system is now ready to use!**
