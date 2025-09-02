import { TransactionService } from '../../services/transactionService';
import { Transaction, Contact, Item, ExpenseType, Brand } from '../../models';
import { CreateTransactionPayloadDTO, UpdateTransactionWithDetailsDTO, TransactionType } from '../../types';

// Mock the models
jest.mock('../../models', () => ({
  Transaction: {
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
  },
  Contact: {
    create: jest.fn(),
    findByPk: jest.fn(),
  },
  Item: {
    create: jest.fn(),
  },
  ExpenseType: {
    create: jest.fn(),
  },
  Brand: {
    create: jest.fn(),
  },
  TransactionItem: {
    bulkCreate: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    sum: jest.fn(),
  },
  TransactionExpense: {
    bulkCreate: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    sum: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
  },
}));

describe('TransactionService', () => {
  let testSupplier: any;
  let testCustomer: any;
  let testItem: any;
  let testExpenseType: any;
  let testBrand: any;
  const testClerkId = 'test-clerk-id';

  beforeEach(async () => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock test data
    testBrand = {
      id: 'brand-1',
      name: 'Test Brand',
    };

    testItem = {
      id: 'item-1',
      brand_id: testBrand.id,
      display_name: 'Test Item',
    };

    testSupplier = {
      id: 'supplier-1',
      name: 'Test Supplier',
      phone: '1234567890',
    };

    testCustomer = {
      id: 'customer-1',
      name: 'Test Customer',
      phone: '0987654321',
    };

    testExpenseType = {
      id: 'expense-type-1',
      name: 'Test Expense Type',
    };

    // Setup mocks
    (Brand.create as jest.Mock).mockResolvedValue(testBrand);
    (Item.create as jest.Mock).mockResolvedValue(testItem);
    (Contact.create as jest.Mock)
      .mockResolvedValueOnce(testSupplier)
      .mockResolvedValueOnce(testCustomer);
    (ExpenseType.create as jest.Mock).mockResolvedValue(testExpenseType);
  });

  describe('create', () => {
    it('should create a buy transaction with products and expenses', async () => {
      const transactionData: CreateTransactionPayloadDTO = {
        transaction_date: '2024-01-15',
        type: TransactionType.BUY,
        supplier_id: testSupplier.id,
        notes: 'Test buy transaction',
        transaction_products: [
          {
            brand_id: testBrand.id,
            product_id: testItem.id,
            quantity: 2,
            amount_per_product: 1000000,
            sub_total: 2000000,
          },
        ],
        transaction_expenses: [
          {
            expense_type: testExpenseType.id,
            amount: 50000,
            notes: 'Shipping cost',
          },
        ],
        sub_total_products: 2000000,
        sub_total_expenses: 50000,
        total: 1950000,
      };

      const mockTransaction = {
        id: 'transaction-1',
        type: TransactionType.BUY,
        supplier_id: testSupplier.id,
        customer_id: null,
        total: '1950000.00',
        transaction_date: '2024-01-15',
        notes: 'Test buy transaction',
        transactionItems: [
          {
            id: 'item-1',
            qty: 2,
            unit_price: '1000000.00',
            subtotal: '2000000.00',
          },
        ],
        transactionExpenses: [
          {
            id: 'expense-1',
            amount: '50000.00',
            subtotal: '50000.00',
          },
        ],
        toJSON: function() {
          return {
            id: this.id,
            type: this.type,
            supplier_id: this.supplier_id,
            customer_id: this.customer_id,
            total: this.total,
            transaction_date: this.transaction_date,
            notes: this.notes,
            transactionItems: this.transactionItems,
            transactionExpenses: this.transactionExpenses,
            sub_total_products: '2000000.00',
            sub_total_expenses: '50000.00',
          };
        },
      };

      const mockTransactionResult = {
        dataValues: { id: 'transaction-1' },
      };

      // Setup mocks
      (Contact.findByPk as jest.Mock).mockResolvedValue(testSupplier);
      (Transaction.create as jest.Mock).mockResolvedValue(mockTransactionResult);
      (Transaction.findByPk as jest.Mock).mockResolvedValue(mockTransaction);
      (require('../../models').TransactionItem.bulkCreate as jest.Mock).mockResolvedValue([]);
      (require('../../models').TransactionExpense.bulkCreate as jest.Mock).mockResolvedValue([]);

      // Mock sequelize transaction
      const mockTransactionFn = jest.fn().mockImplementation(async (callback) => {
        return await callback({});
      });
      (require('../../models').sequelize.transaction as jest.Mock).mockImplementation(mockTransactionFn);

      const result = await TransactionService.create(transactionData, testClerkId);

      expect(result).toBeDefined();
      expect(result.id).toBe('transaction-1');
      expect(result.type).toBe(TransactionType.BUY);
      expect(result.supplier_id).toBe(testSupplier.id);
      expect(result.customer_id).toBeNull();
      expect(result.total).toBe('1950000.00');
      expect(result.transactionItems).toHaveLength(1);
      expect(result.transactionExpenses).toHaveLength(1);
    });

    it('should throw error when no products provided', async () => {
      const transactionData: CreateTransactionPayloadDTO = {
        transaction_date: '2024-01-15',
        type: TransactionType.BUY,
        supplier_id: testSupplier.id,
        notes: 'Test transaction without products',
        transaction_products: [],
        sub_total_products: 0,
        sub_total_expenses: 0,
        total: 0,
      };

      await expect(TransactionService.create(transactionData, testClerkId))
        .rejects
        .toThrow('Transaction Products not found');
    });

    it('should throw error when buy transaction has no supplier', async () => {
      const transactionData: CreateTransactionPayloadDTO = {
        transaction_date: '2024-01-15',
        type: TransactionType.BUY,
        notes: 'Test buy transaction without supplier',
        transaction_products: [
          {
            brand_id: testBrand.id,
            product_id: testItem.id,
            quantity: 1,
            amount_per_product: 1000000,
            sub_total: 1000000,
          },
        ],
        sub_total_products: 1000000,
        sub_total_expenses: 0,
        total: 1000000,
      };

      await expect(TransactionService.create(transactionData, testClerkId))
        .rejects
        .toThrow('Supplier ID is required for BUY transactions');
    });

    it('should throw error when sell transaction has no customer', async () => {
      const transactionData: CreateTransactionPayloadDTO = {
        transaction_date: '2024-01-15',
        type: TransactionType.SELL,
        notes: 'Test sell transaction without customer',
        transaction_products: [
          {
            brand_id: testBrand.id,
            product_id: testItem.id,
            quantity: 1,
            amount_per_product: 1000000,
            sub_total: 1000000,
          },
        ],
        sub_total_products: 1000000,
        sub_total_expenses: 0,
        total: 1000000,
      };

      await expect(TransactionService.create(transactionData, testClerkId))
        .rejects
        .toThrow('Customer ID is required for SELL transactions');
    });
  });

  describe('update', () => {
    let existingTransaction: any;

    beforeEach(async () => {
      // Mock existing transaction
      existingTransaction = {
        id: 'transaction-1',
        type: TransactionType.BUY,
        supplier_id: testSupplier.id,
        customer_id: null,
        total: 1950000,
        transaction_date: '2024-01-15',
        notes: 'Original transaction',
        transactionItems: [
          {
            id: 'item-1',
            qty: 2,
            unit_price: 1000000,
            subtotal: 2000000,
          },
        ],
        transactionExpenses: [
          {
            id: 'expense-1',
            amount: 50000,
            subtotal: 50000,
          },
        ],
      };

      // Setup mocks
      (Transaction.findByPk as jest.Mock).mockResolvedValue(existingTransaction);
      (Contact.findByPk as jest.Mock).mockResolvedValue(testSupplier);
      (require('../../models').TransactionItem.sum as jest.Mock).mockResolvedValue(2000000);
      (require('../../models').TransactionExpense.sum as jest.Mock).mockResolvedValue(50000);

      // Mock sequelize transaction
      const mockTransactionFn = jest.fn().mockImplementation(async (callback) => {
        return await callback({});
      });
      (require('../../models').sequelize.transaction as jest.Mock).mockImplementation(mockTransactionFn);
    });

    it('should update basic transaction fields', async () => {
      const updateData: UpdateTransactionWithDetailsDTO = {
        notes: 'Updated transaction notes',
        transaction_date: new Date('2024-01-20'),
      };

      const updatedTransaction = {
        ...existingTransaction,
        notes: 'Updated transaction notes',
        transaction_date: '2024-01-20',
      };

      (TransactionService.findById as jest.Mock) = jest.fn().mockResolvedValue(updatedTransaction);

      const result = await TransactionService.update(existingTransaction.id, updateData, testClerkId);

      expect(result.notes).toBe('Updated transaction notes');
      expect(result.transaction_date).toBe('2024-01-20');
    });

    it('should delete all products when empty array is provided', async () => {
      const updateData: UpdateTransactionWithDetailsDTO = {
        transaction_products: [],
      };

      const updatedTransaction = {
        ...existingTransaction,
        transactionItems: [],
        total: '-50000.00',
      };

      (TransactionService.findById as jest.Mock) = jest.fn().mockResolvedValue(updatedTransaction);

      const result = await TransactionService.update(existingTransaction.id, updateData, testClerkId);

      expect(result.transactionItems).toHaveLength(0);
      expect(result.total).toBe('-50000.00');
    });

    it('should throw error when transaction not found', async () => {
      const updateData: UpdateTransactionWithDetailsDTO = {
        notes: 'Update non-existent transaction',
      };

      (Transaction.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(TransactionService.update('non-existent-id', updateData, testClerkId))
        .rejects
        .toThrow('Transaction not found');
    });

    it('should throw error when supplier not found', async () => {
      const updateData: UpdateTransactionWithDetailsDTO = {
        supplier_id: 'non-existent-supplier-id',
      };

      (Contact.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(TransactionService.update(existingTransaction.id, updateData, testClerkId))
        .rejects
        .toThrow('Supplier not found');
    });
  });
});
