import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  // Indexes for transactions table - optimized for dashboard queries
  await queryInterface.addIndex('transactions', {
    fields: ['type', 'transaction_date'],
    name: 'idx_transactions_type_date'
  });

  await queryInterface.addIndex('transactions', {
    fields: ['transaction_date'],
    name: 'idx_transactions_date'
  });

  await queryInterface.addIndex('transactions', {
    fields: ['type'],
    name: 'idx_transactions_type'
  });

  // Composite index for supplier/customer queries
  await queryInterface.addIndex('transactions', {
    fields: ['supplier_id', 'transaction_date'],
    name: 'idx_transactions_supplier_date'
  });

  await queryInterface.addIndex('transactions', {
    fields: ['customer_id', 'transaction_date'],
    name: 'idx_transactions_customer_date'
  });

  // Indexes for transaction_expenses table
  await queryInterface.addIndex('transaction_expenses', {
    fields: ['transaction_id'],
    name: 'idx_transaction_expenses_transaction_id'
  });

  // Composite index for expense amount queries
  await queryInterface.addIndex('transaction_expenses', {
    fields: ['amount'],
    name: 'idx_transaction_expenses_amount'
  });
};

export const down = async (queryInterface: QueryInterface) => {
  // Remove indexes in reverse order
  await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_amount');
  await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_transaction_id');
  await queryInterface.removeIndex('transactions', 'idx_transactions_customer_date');
  await queryInterface.removeIndex('transactions', 'idx_transactions_supplier_date');
  await queryInterface.removeIndex('transactions', 'idx_transactions_type');
  await queryInterface.removeIndex('transactions', 'idx_transactions_date');
  await queryInterface.removeIndex('transactions', 'idx_transactions_type_date');
};
