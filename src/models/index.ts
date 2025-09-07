import sequelize from '../config/database.js';
import Contact from './Contact';
import Brand from './Brand';
import Item from './Item';
import ExpenseType from './ExpenseType';
import Transaction from './Transaction';
import TransactionItem from './TransactionItem';
import TransactionExpense from './TransactionExpense';

// Define associations

// Contact associations
Contact.hasMany(Transaction, { foreignKey: 'supplier_id', as: 'supplierTransactions' });
Contact.hasMany(Transaction, { foreignKey: 'customer_id', as: 'customerTransactions' });

// Brand associations
Brand.hasMany(Item, { foreignKey: 'brand_id', as: 'items' });

// Item associations
Item.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });
Item.hasMany(TransactionItem, { foreignKey: 'item_id', as: 'transactionItems' });

// ExpenseType associations
ExpenseType.hasMany(TransactionExpense, { foreignKey: 'expense_type_id', as: 'transactionExpenses' });

// Transaction associations
Transaction.belongsTo(Contact, { foreignKey: 'supplier_id', as: 'supplier' });
Transaction.belongsTo(Contact, { foreignKey: 'customer_id', as: 'customer' });
Transaction.hasMany(TransactionItem, { foreignKey: 'transaction_id', as: 'transactionItems' });
Transaction.hasMany(TransactionExpense, { foreignKey: 'transaction_id', as: 'transactionExpenses' });

// TransactionItem associations
TransactionItem.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' });
TransactionItem.belongsTo(Item, { foreignKey: 'item_id', as: 'item' });

// TransactionExpense associations
TransactionExpense.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' });
TransactionExpense.belongsTo(ExpenseType, { foreignKey: 'expense_type_id', as: 'expenseType' });

// Export all models
export {
  sequelize,
  Contact,
  Brand,
  Item,
  ExpenseType,
  Transaction,
  TransactionItem,
  TransactionExpense,
};

// Database initialization function
export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models
    await sequelize.sync({ force: false });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};
