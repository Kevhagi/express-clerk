# Clerk Express Quickstart with Sequelize

A complete Node.js Express application with Sequelize ORM, implementing a full CRUD API for a transaction management system.

## Database Schema

The application implements the following entities:
- **Users**: Application users
- **Contacts**: Suppliers and customers
- **Brands**: Product brands
- **Items**: Products with specifications
- **Expense Types**: Categories for transaction expenses
- **Transactions**: Sales (`Penjualan`) and Purchase (`Pembelian`) transactions
- **Transaction Items**: Items within transactions
- **Transaction Expenses**: Additional expenses for transactions

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Database Setup:**
   - Create a PostgreSQL database
   - Update your `.env` file with database credentials:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=clerk_express_db
   
   # Clerk Configuration
   CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret
   
   # Server Configuration
   PORT=3002
   NODE_ENV=development
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

The application will automatically:
- Connect to the database
- Create all tables with proper relationships
- Start the server on the specified port

## API Endpoints

All endpoints are available under `/api`:

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Contacts
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get contact by ID
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Brands
- `GET /api/brands` - Get all brands
- `GET /api/brands/:id` - Get brand by ID
- `POST /api/brands` - Create brand
- `PUT /api/brands/:id` - Update brand
- `DELETE /api/brands/:id` - Delete brand

### Expense Types
- `GET /api/expense-types` - Get all expense types
- `GET /api/expense-types/:id` - Get expense type by ID
- `POST /api/expense-types` - Create expense type
- `PUT /api/expense-types/:id` - Update expense type
- `DELETE /api/expense-types/:id` - Delete expense type

### Items
- `GET /api/items` - Get all items (with brand info)
- `GET /api/items/:id` - Get item by ID (with brand info)
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Transactions
- `GET /api/transactions` - Get all transactions (with full details)
- `GET /api/transactions/:id` - Get transaction by ID (with full details)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Transaction Items
- `GET /api/transaction-items` - Get all transaction items
- `GET /api/transaction-items/:id` - Get transaction item by ID
- `POST /api/transaction-items` - Create transaction item
- `PUT /api/transaction-items/:id` - Update transaction item
- `DELETE /api/transaction-items/:id` - Delete transaction item

### Transaction Expenses
- `GET /api/transaction-expenses` - Get all transaction expenses
- `GET /api/transaction-expenses/:id` - Get transaction expense by ID
- `POST /api/transaction-expenses` - Create transaction expense
- `PUT /api/transaction-expenses/:id` - Update transaction expense
- `DELETE /api/transaction-expenses/:id` - Delete transaction expense

## Sample API Requests

### Create User
```json
POST /api/users
{
  "firstName": "John",
  "lastName": "Doe"
}
```

### Create Contact
```json
POST /api/contacts
{
  "name": "ABC Supplier",
  "phone": "+1234567890"
}
```

### Create Brand
```json
POST /api/brands
{
  "name": "Apple"
}
```

### Create Item
```json
POST /api/items
{
  "brand_id": 1,
  "model_name": "iPhone 15 Pro",
  "ram_gb": 8,
  "storage_gb": 256,
  "display_name": "iPhone 15 Pro 256GB"
}
```

### Create Transaction
```json
POST /api/transactions
{
  "supplier_id": 2,
  "customer_id": null,
  "type": "Pembelian",
  "total": 15000000.00,
  "transaction_date": "2024-01-15T10:30:00.000Z",
  "notes": "Purchase of smartphones for inventory"
}
```

### Create Transaction Item
```json
POST /api/transaction-items
{
  "transaction_id": 1,
  "item_id": 2,
  "unit_price": 12000000.00,
  "qty": 2,
  "subtotal": 24000000.00
}
```

### Create Transaction Expense
```json
POST /api/transaction-expenses
{
  "transaction_id": 1,
  "expense_type_id": 2,
  "amount": 500000.00,
  "notes": "Shipping cost for bulk order",
  "subtotal": 500000.00
}
```

## Project Structure

```
src/
├── config/
│   └── database.ts          # Database configuration
├── controllers/
│   ├── userController.ts
│   ├── contactController.ts
│   ├── brandController.ts
│   ├── expenseTypeController.ts
│   ├── itemController.ts
│   ├── transactionController.ts
│   ├── transactionItemController.ts
│   └── transactionExpenseController.ts
├── migrations/
│   ├── 001-create-users.ts
│   ├── 002-create-contacts.ts
│   ├── 003-create-brands.ts
│   ├── 004-create-expense-types.ts
│   ├── 005-create-items.ts
│   ├── 006-create-transactions.ts
│   ├── 007-create-transaction-items.ts
│   └── 008-create-transaction-expenses.ts
├── models/
│   ├── User.ts
│   ├── Contact.ts
│   ├── Brand.ts
│   ├── ExpenseType.ts
│   ├── Item.ts
│   ├── Transaction.ts
│   ├── TransactionItem.ts
│   ├── TransactionExpense.ts
│   └── index.ts             # Model associations
├── routes/
│   ├── userRoutes.ts
│   ├── contactRoutes.ts
│   ├── brandRoutes.ts
│   ├── expenseTypeRoutes.ts
│   ├── itemRoutes.ts
│   ├── transactionRoutes.ts
│   ├── transactionItemRoutes.ts
│   ├── transactionExpenseRoutes.ts
│   └── index.ts             # Route aggregation
├── types/
│   └── index.ts             # TypeScript interfaces
└── index.ts                 # Main application file
```

## Features

- ✅ Complete CRUD operations for all entities
- ✅ Proper foreign key relationships
- ✅ TypeScript interfaces and DTOs
- ✅ Sequelize migrations
- ✅ Error handling
- ✅ Transaction type ENUM (`Penjualan`, `Pembelian`)
- ✅ Eager loading for related data
- ✅ Clean folder structure
- ✅ Async/await pattern
- ✅ Input validation
- ✅ Clerk authentication integration

The application is ready to run and provides a complete API for managing transactions, items, users, and related entities.
