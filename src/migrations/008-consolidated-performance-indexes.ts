import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  // ===== TRANSACTIONS TABLE INDEXES =====
  
  // Core transaction indexes for basic queries
  await queryInterface.addIndex('transactions', {
    fields: ['type'],
    name: 'idx_transactions_type'
  });

  await queryInterface.addIndex('transactions', {
    fields: ['transaction_date'],
    name: 'idx_transactions_date'
  });

  await queryInterface.addIndex('transactions', {
    fields: ['created_at'],
    name: 'idx_transactions_created_at'
  });

  // Composite indexes for common query patterns
  await queryInterface.addIndex('transactions', {
    fields: ['type', 'transaction_date'],
    name: 'idx_transactions_type_date'
  });

  await queryInterface.addIndex('transactions', {
    fields: ['type', 'total'],
    name: 'idx_transactions_type_total'
  });

  await queryInterface.addIndex('transactions', {
    fields: ['type', 'transaction_date', 'total'],
    name: 'idx_transactions_type_date_total'
  });

  await queryInterface.addIndex('transactions', {
    fields: ['transaction_date', 'type', 'id'],
    name: 'idx_transactions_date_type_id'
  });

  // Supplier and customer relationship indexes
  await queryInterface.addIndex('transactions', {
    fields: ['supplier_id', 'transaction_date'],
    name: 'idx_transactions_supplier_date'
  });

  await queryInterface.addIndex('transactions', {
    fields: ['customer_id', 'transaction_date'],
    name: 'idx_transactions_customer_date'
  });

  await queryInterface.addIndex('transactions', {
    fields: ['supplier_id', 'type', 'transaction_date', 'created_at'],
    name: 'idx_transactions_supplier_type_date_created'
  });

  await queryInterface.addIndex('transactions', {
    fields: ['customer_id', 'type', 'transaction_date', 'created_at'],
    name: 'idx_transactions_customer_type_date_created'
  });

  // ===== TRANSACTION_ITEMS TABLE INDEXES =====
  
  // Core indexes
  await queryInterface.addIndex('transaction_items', {
    fields: ['transaction_id'],
    name: 'idx_transaction_items_transaction_id'
  });

  await queryInterface.addIndex('transaction_items', {
    fields: ['item_id'],
    name: 'idx_transaction_items_item_id'
  });

  await queryInterface.addIndex('transaction_items', {
    fields: ['subtotal'],
    name: 'idx_transaction_items_subtotal'
  });

  await queryInterface.addIndex('transaction_items', {
    fields: ['created_at'],
    name: 'idx_transaction_items_created_at'
  });

  // Composite indexes for JOIN optimization
  await queryInterface.addIndex('transaction_items', {
    fields: ['transaction_id', 'item_id'],
    name: 'idx_transaction_items_transaction_item'
  });

  await queryInterface.addIndex('transaction_items', {
    fields: ['transaction_id', 'subtotal'],
    name: 'idx_transaction_items_transaction_subtotal'
  });

  await queryInterface.addIndex('transaction_items', {
    fields: ['transaction_id', 'created_at'],
    name: 'idx_transaction_items_transaction_created'
  });

  await queryInterface.addIndex('transaction_items', {
    fields: ['transaction_id', 'subtotal', 'created_at'],
    name: 'idx_transaction_items_transaction_subtotal_created'
  });

  // ===== TRANSACTION_EXPENSES TABLE INDEXES =====
  
  // Core indexes
  await queryInterface.addIndex('transaction_expenses', {
    fields: ['transaction_id'],
    name: 'idx_transaction_expenses_transaction_id'
  });

  await queryInterface.addIndex('transaction_expenses', {
    fields: ['expense_type_id'],
    name: 'idx_transaction_expenses_expense_type_id'
  });

  await queryInterface.addIndex('transaction_expenses', {
    fields: ['amount'],
    name: 'idx_transaction_expenses_amount'
  });

  await queryInterface.addIndex('transaction_expenses', {
    fields: ['subtotal'],
    name: 'idx_transaction_expenses_subtotal'
  });

  await queryInterface.addIndex('transaction_expenses', {
    fields: ['created_at'],
    name: 'idx_transaction_expenses_created_at'
  });

  // Composite indexes for JOIN optimization
  await queryInterface.addIndex('transaction_expenses', {
    fields: ['transaction_id', 'expense_type_id'],
    name: 'idx_transaction_expenses_transaction_expense_type'
  });

  await queryInterface.addIndex('transaction_expenses', {
    fields: ['transaction_id', 'amount'],
    name: 'idx_transaction_expenses_transaction_amount'
  });

  await queryInterface.addIndex('transaction_expenses', {
    fields: ['transaction_id', 'subtotal'],
    name: 'idx_transaction_expenses_transaction_subtotal'
  });

  await queryInterface.addIndex('transaction_expenses', {
    fields: ['transaction_id', 'amount', 'created_at'],
    name: 'idx_transaction_expenses_transaction_amount_created'
  });

  // ===== CONTACTS TABLE INDEXES =====
  
  // Core indexes
  await queryInterface.addIndex('contacts', {
    fields: ['name'],
    name: 'idx_contacts_name'
  });

  await queryInterface.addIndex('contacts', {
    fields: ['phone'],
    name: 'idx_contacts_phone'
  });

  await queryInterface.addIndex('contacts', {
    fields: ['created_at'],
    name: 'idx_contacts_created_at'
  });

  // Composite indexes
  await queryInterface.addIndex('contacts', {
    fields: ['name', 'phone'],
    name: 'idx_contacts_name_phone'
  });

  await queryInterface.addIndex('contacts', {
    fields: ['name', 'created_at'],
    name: 'idx_contacts_name_created'
  });

  // Advanced text search indexes (GIN) with fallbacks
  try {
    await queryInterface.sequelize.query(`
      CREATE INDEX idx_contacts_name_gin ON contacts USING gin(to_tsvector('english', name));
    `);
  } catch (error) {
    // Fallback to regular index if GIN is not supported
    await queryInterface.addIndex('contacts', {
      fields: ['name'],
      name: 'idx_contacts_name_gin_fallback'
    });
  }

  try {
    await queryInterface.sequelize.query(`
      CREATE INDEX idx_contacts_phone_gin ON contacts USING gin(to_tsvector('english', phone));
    `);
  } catch (error) {
    // Fallback to regular index if GIN is not supported
    await queryInterface.addIndex('contacts', {
      fields: ['phone'],
      name: 'idx_contacts_phone_gin_fallback'
    });
  }

  // ===== ITEMS TABLE INDEXES =====
  
  // Core indexes
  await queryInterface.addIndex('items', {
    fields: ['brand_id'],
    name: 'idx_items_brand_id'
  });

  await queryInterface.addIndex('items', {
    fields: ['model_name'],
    name: 'idx_items_model_name'
  });

  await queryInterface.addIndex('items', {
    fields: ['created_at'],
    name: 'idx_items_created_at'
  });

  // Composite indexes
  await queryInterface.addIndex('items', {
    fields: ['brand_id', 'model_name'],
    name: 'idx_items_brand_model'
  });

  await queryInterface.addIndex('items', {
    fields: ['brand_id', 'model_name', 'created_at'],
    name: 'idx_items_brand_model_created'
  });

  // Advanced text search index (GIN) with fallback
  try {
    await queryInterface.sequelize.query(`
      CREATE INDEX idx_items_model_name_gin ON items USING gin(to_tsvector('english', model_name));
    `);
  } catch (error) {
    // Fallback to regular index if GIN is not supported
    await queryInterface.addIndex('items', {
      fields: ['model_name'],
      name: 'idx_items_model_name_gin_fallback'
    });
  }

  // ===== BRANDS TABLE INDEXES =====
  
  // Core indexes
  await queryInterface.addIndex('brands', {
    fields: ['name'],
    name: 'idx_brands_name'
  });

  await queryInterface.addIndex('brands', {
    fields: ['created_at'],
    name: 'idx_brands_created_at'
  });

  // Composite index
  await queryInterface.addIndex('brands', {
    fields: ['name', 'created_at'],
    name: 'idx_brands_name_created'
  });

  // ===== EXPENSE_TYPES TABLE INDEXES =====
  
  // Core indexes
  await queryInterface.addIndex('expense_types', {
    fields: ['name'],
    name: 'idx_expense_types_name'
  });

  await queryInterface.addIndex('expense_types', {
    fields: ['created_at'],
    name: 'idx_expense_types_created_at'
  });

  // Composite index
  await queryInterface.addIndex('expense_types', {
    fields: ['name', 'created_at'],
    name: 'idx_expense_types_name_created'
  });
};

export const down = async (queryInterface: QueryInterface) => {
  // Remove indexes in reverse order
  
  // Expense Types
  try {
    await queryInterface.removeIndex('expense_types', 'idx_expense_types_name_created');
  } catch (error) {
    console.log('Index idx_expense_types_name_created might not exist');
  }

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

  // Brands
  try {
    await queryInterface.removeIndex('brands', 'idx_brands_name_created');
  } catch (error) {
    console.log('Index idx_brands_name_created might not exist');
  }

  try {
    await queryInterface.removeIndex('brands', 'idx_brands_created_at');
  } catch (error) {
    console.log('Index idx_brands_created_at might not exist');
  }

  try {
    await queryInterface.removeIndex('brands', 'idx_brands_name');
  } catch (error) {
    console.log('Index idx_brands_name might not exist');
  }

  // Items
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
    await queryInterface.removeIndex('items', 'idx_items_created_at');
  } catch (error) {
    console.log('Index idx_items_created_at might not exist');
  }

  try {
    await queryInterface.removeIndex('items', 'idx_items_model_name');
  } catch (error) {
    console.log('Index idx_items_model_name might not exist');
  }

  try {
    await queryInterface.removeIndex('items', 'idx_items_brand_id');
  } catch (error) {
    console.log('Index idx_items_brand_id might not exist');
  }

  try {
    await queryInterface.removeIndex('items', 'idx_items_model_name_gin_fallback');
  } catch (error) {
    console.log('Index idx_items_model_name_gin_fallback might not exist');
  }

  try {
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_items_model_name_gin;`);
  } catch (error) {
    console.log('GIN index idx_items_model_name_gin might not exist');
  }

  // Contacts
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
    await queryInterface.removeIndex('contacts', 'idx_contacts_created_at');
  } catch (error) {
    console.log('Index idx_contacts_created_at might not exist');
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

  try {
    await queryInterface.removeIndex('contacts', 'idx_contacts_phone_gin_fallback');
  } catch (error) {
    console.log('Index idx_contacts_phone_gin_fallback might not exist');
  }

  try {
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_contacts_phone_gin;`);
  } catch (error) {
    console.log('GIN index idx_contacts_phone_gin might not exist');
  }

  try {
    await queryInterface.removeIndex('contacts', 'idx_contacts_name_gin_fallback');
  } catch (error) {
    console.log('Index idx_contacts_name_gin_fallback might not exist');
  }

  try {
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_contacts_name_gin;`);
  } catch (error) {
    console.log('GIN index idx_contacts_name_gin might not exist');
  }

  // Transaction Expenses
  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_transaction_amount_created');
  } catch (error) {
    console.log('Index idx_transaction_expenses_transaction_amount_created might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_transaction_subtotal');
  } catch (error) {
    console.log('Index idx_transaction_expenses_transaction_subtotal might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_transaction_amount');
  } catch (error) {
    console.log('Index idx_transaction_expenses_transaction_amount might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_created_at');
  } catch (error) {
    console.log('Index idx_transaction_expenses_created_at might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_subtotal');
  } catch (error) {
    console.log('Index idx_transaction_expenses_subtotal might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_amount');
  } catch (error) {
    console.log('Index idx_transaction_expenses_amount might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_expense_type_id');
  } catch (error) {
    console.log('Index idx_transaction_expenses_expense_type_id might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_transaction_id');
  } catch (error) {
    console.log('Index idx_transaction_expenses_transaction_id might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_expenses', 'idx_transaction_expenses_transaction_expense_type');
  } catch (error) {
    console.log('Index idx_transaction_expenses_transaction_expense_type might not exist');
  }

  // Transaction Items
  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_transaction_subtotal_created');
  } catch (error) {
    console.log('Index idx_transaction_items_transaction_subtotal_created might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_transaction_created');
  } catch (error) {
    console.log('Index idx_transaction_items_transaction_created might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_transaction_subtotal');
  } catch (error) {
    console.log('Index idx_transaction_items_transaction_subtotal might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_created_at');
  } catch (error) {
    console.log('Index idx_transaction_items_created_at might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_subtotal');
  } catch (error) {
    console.log('Index idx_transaction_items_subtotal might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_item_id');
  } catch (error) {
    console.log('Index idx_transaction_items_item_id might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_transaction_id');
  } catch (error) {
    console.log('Index idx_transaction_items_transaction_id might not exist');
  }

  try {
    await queryInterface.removeIndex('transaction_items', 'idx_transaction_items_transaction_item');
  } catch (error) {
    console.log('Index idx_transaction_items_transaction_item might not exist');
  }

  // Transactions
  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_customer_type_date_created');
  } catch (error) {
    console.log('Index idx_transactions_customer_type_date_created might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_supplier_type_date_created');
  } catch (error) {
    console.log('Index idx_transactions_supplier_type_date_created might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_date_type_id');
  } catch (error) {
    console.log('Index idx_transactions_date_type_id might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_type_date_total');
  } catch (error) {
    console.log('Index idx_transactions_type_date_total might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_type_total');
  } catch (error) {
    console.log('Index idx_transactions_type_total might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_customer_date');
  } catch (error) {
    console.log('Index idx_transactions_customer_date might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_supplier_date');
  } catch (error) {
    console.log('Index idx_transactions_supplier_date might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_created_at');
  } catch (error) {
    console.log('Index idx_transactions_created_at might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_type_date');
  } catch (error) {
    console.log('Index idx_transactions_type_date might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_date');
  } catch (error) {
    console.log('Index idx_transactions_date might not exist');
  }

  try {
    await queryInterface.removeIndex('transactions', 'idx_transactions_type');
  } catch (error) {
    console.log('Index idx_transactions_type might not exist');
  }
};
