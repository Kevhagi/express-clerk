import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  // ===== CONTACTS TABLE INDEXES =====
  // For ContactService.findWithPagination - name and phone LIKE queries
  await queryInterface.addIndex('contacts', {
    fields: ['name'],
    name: 'idx_contacts_name'
  });

  await queryInterface.addIndex('contacts', {
    fields: ['phone'],
    name: 'idx_contacts_phone'
  });

  // Composite index for name and phone searches
  await queryInterface.addIndex('contacts', {
    fields: ['name', 'phone'],
    name: 'idx_contacts_name_phone'
  });

  // Index for ordering by name
  await queryInterface.addIndex('contacts', {
    fields: ['name', 'created_at'],
    name: 'idx_contacts_name_created'
  });

  // ===== BRANDS TABLE INDEXES =====
  // For BrandService.findWithPagination - ordering by name
  await queryInterface.addIndex('brands', {
    fields: ['name'],
    name: 'idx_brands_name'
  });

  await queryInterface.addIndex('brands', {
    fields: ['name', 'created_at'],
    name: 'idx_brands_name_created'
  });

  // ===== ITEMS TABLE INDEXES =====
  // For ItemService.findWithPagination - model_name ILIKE and brand_id IN queries
  await queryInterface.addIndex('items', {
    fields: ['model_name'],
    name: 'idx_items_model_name'
  });

  await queryInterface.addIndex('items', {
    fields: ['brand_id'],
    name: 'idx_items_brand_id'
  });

  // Composite index for brand_id and model_name searches
  await queryInterface.addIndex('items', {
    fields: ['brand_id', 'model_name'],
    name: 'idx_items_brand_model'
  });

  // Index for ordering by brand name and model_name
  await queryInterface.addIndex('items', {
    fields: ['brand_id', 'model_name', 'created_at'],
    name: 'idx_items_brand_model_created'
  });

  // ===== TRANSACTIONS TABLE ADDITIONAL INDEXES =====
  // For TransactionService.findWithPagination - date range queries
  await queryInterface.addIndex('transactions', {
    fields: ['transaction_date', 'type'],
    name: 'idx_transactions_date_type'
  });

  // For ordering by created_at DESC
  await queryInterface.addIndex('transactions', {
    fields: ['created_at'],
    name: 'idx_transactions_created_at'
  });

  // Composite index for supplier_id and date range
  await queryInterface.addIndex('transactions', {
    fields: ['supplier_id', 'transaction_date', 'created_at'],
    name: 'idx_transactions_supplier_date_created'
  });

  // Composite index for customer_id and date range
  await queryInterface.addIndex('transactions', {
    fields: ['customer_id', 'transaction_date', 'created_at'],
    name: 'idx_transactions_customer_date_created'
  });

  // ===== TRANSACTION_ITEMS TABLE ADDITIONAL INDEXES =====
  // For TransactionItemService.findWithPagination
  await queryInterface.addIndex('transaction_items', {
    fields: ['item_id'],
    name: 'idx_transaction_items_item_id'
  });

  // Composite index for transaction_id and item_id
  await queryInterface.addIndex('transaction_items', {
    fields: ['transaction_id', 'item_id'],
    name: 'idx_transaction_items_transaction_item'
  });

  // Index for ordering by created_at DESC
  await queryInterface.addIndex('transaction_items', {
    fields: ['created_at'],
    name: 'idx_transaction_items_created_at'
  });

  // ===== TRANSACTION_EXPENSES TABLE ADDITIONAL INDEXES =====
  // For TransactionExpenseService.findWithPagination
  await queryInterface.addIndex('transaction_expenses', {
    fields: ['expense_type_id'],
    name: 'idx_transaction_expenses_expense_type_id'
  });

  // Composite index for transaction_id and expense_type_id
  await queryInterface.addIndex('transaction_expenses', {
    fields: ['transaction_id', 'expense_type_id'],
    name: 'idx_transaction_expenses_transaction_expense_type'
  });

  // Index for ordering by created_at DESC
  await queryInterface.addIndex('transaction_expenses', {
    fields: ['created_at'],
    name: 'idx_transaction_expenses_created_at'
  });

  // ===== EXPENSE_TYPES TABLE INDEXES =====
  // For ExpenseTypeService.findAll - ordering
  await queryInterface.addIndex('expense_types', {
    fields: ['name'],
    name: 'idx_expense_types_name'
  });

  await queryInterface.addIndex('expense_types', {
    fields: ['created_at'],
    name: 'idx_expense_types_created_at'
  });
};

export const down = async (queryInterface: QueryInterface) => {
  // Remove indexes in reverse order
  try {
    await queryInterface.removeIndex('expense_types', 'idx_expense_types_created_at');
  } catch (error) {
    console.log('Index idx_expense_types_created_at might not exist');
  }

  try {
    await queryInterface.removeIndex('expense_types', 'idx_expense_types_name');
  } catch (error) {
    console.log('Index idx_expense_types_name might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_created_at');
  } catch (error) {
    console.log('Index idx_transaction_expenses_created_at might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_transaction_expense_type');
  } catch (error) {
    console.log('Index idx_transaction_expenses_transaction_expense_type might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_expense_type_id');
  } catch (error) {
    console.log('Index idx_transaction_expenses_expense_type_id might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_created_at');
  } catch (error) {
    console.log('Index idx_transaction_items_created_at might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_transaction_item');
  } catch (error) {
    console.log('Index idx_transaction_items_transaction_item might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_item_id');
  } catch (error) {
    console.log('Index idx_transaction_items_item_id might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_customer_date_created');
  } catch (error) {
    console.log('Index idx_transactions_customer_date_created might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_supplier_date_created');
  } catch (error) {
    console.log('Index idx_transactions_supplier_date_created might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_created_at');
  } catch (error) {
    console.log('Index idx_transactions_created_at might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_date_type');
  } catch (error) {
    console.log('Index idx_transactions_date_type might not exist');
  }

  try {
    await queryInterface.removeIndex('items', 'idx_items_brand_model_created');
  } catch (error) {
    console.log('Index idx_items_brand_model_created might not exist');
  }

  try {
    await queryInterface.removeIndex('items', 'idx_items_brand_model');
  } catch (error) {
    console.log('Index idx_items_brand_model might not exist');
  }

  try {
    await queryInterface.removeIndex('items', 'idx_items_brand_id');
  } catch (error) {
    console.log('Index idx_items_brand_id might not exist');
  }

  try {
    await queryInterface.removeIndex('items', 'idx_items_model_name');
  } catch (error) {
    console.log('Index idx_items_model_name might not exist');
  }

  try {
    await queryInterface.removeIndex('brands', 'idx_brands_name_created');
  } catch (error) {
    console.log('Index idx_brands_name_created might not exist');
  }

  try {
    await queryInterface.removeIndex('brands', 'idx_brands_name');
  } catch (error) {
    console.log('Index idx_brands_name might not exist');
  }

  try {
    await queryInterface.removeIndex('contacts', 'idx_contacts_name_created');
  } catch (error) {
    console.log('Index idx_contacts_name_created might not exist');
  }

  try {
    await queryInterface.removeIndex('contacts', 'idx_contacts_name_phone');
  } catch (error) {
    console.log('Index idx_contacts_name_phone might not exist');
  }

  try {
    await queryInterface.removeIndex('contacts', 'idx_contacts_phone');
  } catch (error) {
    console.log('Index idx_contacts_phone might not exist');
  }

  try {
    await queryInterface.removeIndex('contacts', 'idx_contacts_name');
  } catch (error) {
    console.log('Index idx_contacts_name might not exist');
  }
};
