import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  // Add missing indexes for transaction_items table
  await queryInterface.addIndex('transaction_items', {
    fields: ['transaction_id'],
    name: 'idx_transaction_items_transaction_id'
  });

  await queryInterface.addIndex('transaction_items', {
    fields: ['subtotal'],
    name: 'idx_transaction_items_subtotal'
  });

  // Add composite index for transaction_items with transaction_id and subtotal
  await queryInterface.addIndex('transaction_items', {
    fields: ['transaction_id', 'subtotal'],
    name: 'idx_transaction_items_transaction_subtotal'
  });

  // Add index for transaction_expenses amount (if not already exists)
  // This might already exist from the previous migration, but let's ensure it
  try {
    await queryInterface.addIndex('transaction_expenses', {
      fields: ['amount'],
      name: 'idx_transaction_expenses_amount_v2'
    });
  } catch (error) {
    // Index might already exist, that's okay
    console.log('Index idx_transaction_expenses_amount_v2 might already exist');
  }

  // Add composite index for transaction_expenses with transaction_id and amount
  await queryInterface.addIndex('transaction_expenses', {
    fields: ['transaction_id', 'amount'],
    name: 'idx_transaction_expenses_transaction_amount'
  });

  // Add index for transactions id (primary key should already be indexed, but let's ensure)
  await queryInterface.addIndex('transactions', {
    fields: ['id'],
    name: 'idx_transactions_id'
  });

  // Add composite index for transactions with type, transaction_date, and id for JOIN optimization
  await queryInterface.addIndex('transactions', {
    fields: ['type', 'transaction_date', 'id'],
    name: 'idx_transactions_type_date_id'
  });
};

export const down = async (queryInterface: QueryInterface) => {
  // Remove indexes in reverse order
  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_type_date_id');
  } catch (error) {
    console.log('Index idx_transactions_type_date_id might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_id');
  } catch (error) {
    console.log('Index idx_transactions_id might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_transaction_amount');
  } catch (error) {
    console.log('Index idx_transaction_expenses_transaction_amount might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_amount_v2');
  } catch (error) {
    console.log('Index idx_transaction_expenses_amount_v2 might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_transaction_subtotal');
  } catch (error) {
    console.log('Index idx_transaction_items_transaction_subtotal might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_subtotal');
  } catch (error) {
    console.log('Index idx_transaction_items_subtotal might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_transaction_id');
  } catch (error) {
    console.log('Index idx_transaction_items_transaction_id might not exist');
  }
};
