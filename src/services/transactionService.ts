import { 
  Transaction, 
  Contact, 
  TransactionItem, 
  TransactionExpense, 
  Item, 
  ExpenseType,
  Brand,
  sequelize
} from '../models';
import { Op } from 'sequelize';
import { 
  CreateTransactionPayloadDTO,
  TransactionResponse,
  PaginatedTransactionResponse,
} from '../types';

export class TransactionService {
  // Helper function to convert date string to date-only format
  private static parseToDateOnly(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  }

  // Create a new transaction (with or without products and expenses)
  static async create(
    transactionData: CreateTransactionPayloadDTO, 
    clerkId: string
  ): Promise<TransactionResponse> {
    const hasProducts = transactionData.transaction_products.length > 0;
    const hasExpenses = 'transaction_expenses' in transactionData && transactionData.transaction_expenses.length > 0;

    // Validation
    if (!hasProducts) {
      throw new Error('Transaction Products not found');
    }

    // Ensure supplier_id is provided for BUY transactions
    if (transactionData.type === 'buy' && !transactionData.supplier_id) {
      throw new Error('Supplier ID is required for BUY transactions');
    }
    

    // Ensure customer_id is provided for SELL transactions
    if (transactionData.type === 'sell' && !transactionData.customer_id) {
      throw new Error('Customer ID is required for SELL transactions');
    }

    let createdTransaction: any = null;
    try {
      // TRANSACTION 1: Create the main transaction record
      const transactionResult = await sequelize.transaction(async (t1) => {
        // Validate supplier exists if provided
        if (transactionData.supplier_id) {
          const supplier = await Contact.findByPk(transactionData.supplier_id);
          if (!supplier) {
            throw new Error('Supplier not found');
          }
        }

        // Validate customer exists if provided
        if ('customer_id' in transactionData && transactionData.customer_id) {
          const customer = await Contact.findByPk(transactionData.customer_id, { transaction: t1 });
          if (!customer) {
            throw new Error('Customer not found');
          }
        }

        // Calculate total: sum of transaction items - sum of transaction expenses
        const totalItems = transactionData.transaction_products.reduce((sum, product) => sum + product.sub_total, 0);
        const totalExpenses = hasExpenses 
          ? transactionData.transaction_expenses.reduce((sum, expense) => sum + expense.amount, 0)
          : 0;
        const calculatedTotal = totalItems - totalExpenses;

        // Create the main transaction record
        const transaction = await Transaction.create({
          supplier_id: transactionData.type === 'buy' ? transactionData.supplier_id : null,
          customer_id: transactionData.type === 'sell' ? transactionData.customer_id : null,
          type: transactionData.type,
          total: calculatedTotal,
          transaction_date: this.parseToDateOnly(transactionData.transaction_date),
          notes: transactionData.notes,
          created_by: clerkId,
          updated_by: clerkId,
        }, { transaction: t1 });
        return transaction;
      });

      // Transaction 1 committed successfully
      createdTransaction = transactionResult;
      console.log("🚀 ~ Transaction 1 ~ created transaction ID:", createdTransaction.dataValues.id)

      // TRANSACTION 2: Create transaction_items and transaction_expenses
      await sequelize.transaction(async (t2) => {
        // Insert transaction_items
        const transactionItems = transactionData.transaction_products.map(product => ({
          transaction_id: createdTransaction.dataValues.id,
          item_id: product.product_id,
          unit_price: product.amount_per_product,
          qty: product.quantity,
          subtotal: product.sub_total,
          created_by: clerkId,
          updated_by: clerkId,
        }));

        await TransactionItem.bulkCreate(transactionItems, { transaction: t2 });
        console.log("🚀 ~ Transaction 2 ~ transaction_items created");

        // Insert transaction_expenses if expenses exist
        if (hasExpenses) {
          const transactionExpenses = transactionData.transaction_expenses.map(expense => ({
            transaction_id: createdTransaction.dataValues.id,
            expense_type_id: expense.expense_type,
            amount: expense.amount,
            notes: expense.notes,
            subtotal: expense.amount,
            created_by: clerkId,
            updated_by: clerkId,
          }));

          await TransactionExpense.bulkCreate(transactionExpenses, { transaction: t2 });
          console.log("🚀 ~ Transaction 2 ~ transaction_expenses created");
        }
      });
      // Transaction 2 committed successfully

      // Fetch the complete transaction with all related data
      const completeTransaction = await Transaction.findByPk(createdTransaction.dataValues.id, {
        include: [
          {
            model: Contact,
            as: 'supplier',
            attributes: ['id', 'name', 'phone']
          },
          {
            model: Contact,
            as: 'customer',
            attributes: ['id', 'name', 'phone']
          },
          {
            model: TransactionItem,
            as: 'transactionItems',
            include: [
              {
                model: Item,
                as: 'item',
                attributes: ['id', 'display_name']
              }
            ]
          },
          {
            model: TransactionExpense,
            as: 'transactionExpenses',
            include: [
              {
                model: ExpenseType,
                as: 'expenseType',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });
      console.log("🚀 ~ TransactionService ~ create ~ completeTransaction:", completeTransaction.dataValues)

      const completeTransactionData = completeTransaction.toJSON() as any;
      
      // Calculate sub_total_products
      const sub_total_products = completeTransactionData.transactionItems?.reduce((sum: number, item: any) => {
        return sum + parseFloat(item.subtotal || '0');
      }, 0) || 0;
      
      // Calculate sub_total_expenses
      const sub_total_expenses = completeTransactionData.transactionExpenses?.reduce((sum: number, expense: any) => {
        return sum + parseFloat(expense.subtotal || '0');
      }, 0) || 0;
      
      return {
        ...completeTransactionData,
        sub_total_products: sub_total_products.toFixed(2),
        sub_total_expenses: sub_total_expenses.toFixed(2)
      } as TransactionResponse;

    } catch (error) {
      console.error('Transaction creation failed:', error);
      
      // If Transaction 2 failed, we need to delete the transaction created in Transaction 1
      if (createdTransaction) {
        try {
          console.log('🧹 Cleaning up orphaned transaction:', createdTransaction.dataValues.id);
          await sequelize.transaction(async (cleanupT) => {
            // Delete the main transaction (CASCADE will automatically delete related records)
            await Transaction.destroy({
              where: { id: createdTransaction.dataValues.id },
              transaction: cleanupT
            });
          });
          console.log('✅ Cleanup completed successfully');
        } catch (cleanupError) {
          console.error('❌ Cleanup failed:', cleanupError);
          // Log the cleanup error but don't throw it to avoid masking the original error
        }
      }
      
      throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : String(error)}`);
    }
  }



  // Find transactions with pagination and optional filters
  static async findWithPagination(
    page: number, 
    limit: number, 
    type?: string,
    supplierId?: string,
    customerId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<PaginatedTransactionResponse> {
    try {
      const offset = (page - 1) * limit;
      
      // Build where clause conditionally
      const whereClause: any = {};
      
      if (type) {
        whereClause.type = type;
      }
      
      if (supplierId) {
        whereClause.supplier_id = supplierId;
      }
      
      if (customerId) {
        whereClause.customer_id = customerId;
      }
      
      if (startDate || endDate) {
        whereClause.transaction_date = {};
        if (startDate) {
          whereClause.transaction_date[Op.gte] = this.parseToDateOnly(startDate);
        }
        if (endDate) {
          whereClause.transaction_date[Op.lte] = this.parseToDateOnly(endDate);
        }
      }

      // Get total count with same filters
      const total = await Transaction.count({
        where: whereClause,
      });

      // Get transactions with pagination and optional filters
      const transactions = await Transaction.findAll({
        include: [
          {
            model: Contact,
            as: 'supplier',
            attributes: ['id', 'name', 'phone']
          },
          {
            model: Contact,
            as: 'customer',
            attributes: ['id', 'name', 'phone']
          },
          {
            model: TransactionItem,
            as: 'transactionItems',
          },
          {
            model: TransactionExpense,
            as: 'transactionExpenses',
          }
        ],
        where: whereClause,
        order: [['created_at', 'DESC']],
        limit,
        offset,
      });

      return {
        transactions: transactions.map(transaction => {
          const transactionDataItem = transaction.toJSON() as any;
          
          // Calculate sub_total_products
          const sub_total_products = transactionDataItem.transactionItems?.reduce((sum: number, item: any) => {
            return sum + parseFloat(item.subtotal || '0');
          }, 0) || 0;
          
          // Calculate sub_total_expenses
          const sub_total_expenses = transactionDataItem.transactionExpenses?.reduce((sum: number, expense: any) => {
            return sum + parseFloat(expense.subtotal || '0');
          }, 0) || 0;
          
          return {
            ...transactionDataItem,
            sub_total_products: sub_total_products.toFixed(2),
            sub_total_expenses: sub_total_expenses.toFixed(2)
          } as TransactionResponse;
        }),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new Error(`Failed to fetch transactions with pagination: ${error}`);
    }
  }

  // Get transaction by ID
  static async findById(id: string): Promise<TransactionResponse | null> {
    try {
      const transaction = await Transaction.findByPk(id, {
        include: [
          {
            model: Contact,
            as: 'supplier',
            attributes: ['id', 'name', 'phone']
          },
          {
            model: Contact,
            as: 'customer',
            attributes: ['id', 'name', 'phone']
          },
          {
            model: TransactionItem,
            as: 'transactionItems',
            include: [
              {
                model: Item,
                as: 'item',
                attributes: ['id', 'brand_id', 'display_name']
              }
            ]
          },
          {
            model: TransactionExpense,
            as: 'transactionExpenses',
            include: [
              {
                model: ExpenseType,
                as: 'expenseType',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });
      if (!transaction) return null;
      
      const transactionDataItem = transaction.toJSON() as any;
      
      // Calculate sub_total_products
      const sub_total_products = transactionDataItem.transactionItems?.reduce((sum: number, item: any) => {
        return sum + parseFloat(item.subtotal || '0');
      }, 0) || 0;
      
      // Calculate sub_total_expenses
      const sub_total_expenses = transactionDataItem.transactionExpenses?.reduce((sum: number, expense: any) => {
        return sum + parseFloat(expense.subtotal || '0');
      }, 0) || 0;
      
      return {
        ...transactionDataItem,
        sub_total_products: sub_total_products.toFixed(2),
        sub_total_expenses: sub_total_expenses.toFixed(2)
      } as TransactionResponse;
    } catch (error) {
      throw new Error(`Failed to fetch transaction with ID ${id}: ${error}`);
    }
  }
}
