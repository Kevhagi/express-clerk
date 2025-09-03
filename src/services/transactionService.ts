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
  UpdateTransactionWithDetailsDTO,
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

        // Calculate total based on transaction type
        const totalItems = transactionData.transaction_products.reduce((sum, product) => sum + product.sub_total, 0);
        const totalExpenses = hasExpenses 
          ? transactionData.transaction_expenses.reduce((sum, expense) => sum + expense.amount, 0)
          : 0;
        
        // For buy transactions: totalItems + totalExpenses
        // For sell transactions: totalItems - totalExpenses
        const calculatedTotal = transactionData.type === 'buy' 
          ? totalItems + totalExpenses 
          : totalItems - totalExpenses;

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
    endDate?: string,
    isReport?: boolean
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
            include: [
              {
                model: Item,
                as: 'item',
                attributes: ['display_name'],
              },
            ]
          },
          {
            model: TransactionExpense,
            as: 'transactionExpenses',
            include: [
              {
                model: ExpenseType,
                as: 'expenseType',
                attributes: ['name']
              }
            ]
          },
          // ...(isSummary ? [] : [
          //   {
          //     model: TransactionItem,
          //     as: 'transactionItems',
          //     include: [
          //       {
          //         model: Item,
          //         as: 'item',
          //         attributes: ['display_name'],
          //       },
          //     ]
          //   },
          //   {
          //     model: TransactionExpense,
          //     as: 'transactionExpenses',
          //     include: [
          //       {
          //         model: ExpenseType,
          //         as: 'expenseType',
          //         attributes: ['name']
          //       }
          //     ]
          //   }
          // ])
        ],
        where: whereClause,
        order: [['created_at', isReport ? 'ASC' : 'DESC']],
        limit: isReport ? 1000 : limit,
        offset,
      });

      // Calculate total debit and credit using optimal queries
      let totalDebit = 0;
      let totalCredit = 0;

      if (!isReport) {
        // For summary mode, calculate totals from the fetched transactions
        transactions.forEach(transaction => {
          const transactionData = transaction.toJSON() as any;
          if (transactionData.type === 'sell') {
            // Debit: sell transactions (income from sales)
            totalDebit += parseFloat(transactionData.total || '0');
          } else if (transactionData.type === 'buy') {
            // Credit: buy transactions (expenses for purchases)
            totalCredit += parseFloat(transactionData.total || '0');
          }
        });
      } else {
        // For report mode (full mode), use optimized separate queries for accurate totals
        // Calculate total debit (sell transactions)
        const debitResult = await Transaction.sum('total', {
          where: {
            ...whereClause,
            type: 'sell'
          }
        });
        totalDebit = debitResult || 0;

        // Calculate total credit (buy transactions + expenses)
        const buyResult = await Transaction.sum('total', {
          where: {
            ...whereClause,
            type: 'buy'
          }
        });
        const buyTotal = buyResult || 0;

        // Calculate total expenses across all transactions
        const expenseResult = await TransactionExpense.sum('subtotal', {
          include: [{
            model: Transaction,
            as: 'transaction',
            where: whereClause,
            attributes: []
          }]
        } as any);
        const expenseTotal = expenseResult || 0;

        totalCredit = buyTotal + expenseTotal;
      }

      // Process transactions based on mode
      const processedTransactions = transactions.map(transaction => {
        const transactionDataItem = transaction.toJSON() as any;

        const sub_total_products = transactionDataItem.transactionItems?.reduce((sum: number, item: any) => {
          return sum + parseFloat(item.subtotal || '0');
        }, 0) || 0;
        
        const sub_total_expenses = transactionDataItem.transactionExpenses?.reduce((sum: number, expense: any) => {
          return sum + parseFloat(expense.subtotal || '0');
        }, 0) || 0;
        
        return {
          ...transactionDataItem,
          sub_total_products: sub_total_products.toFixed(2),
          sub_total_expenses: sub_total_expenses.toFixed(2)
        } as TransactionResponse;
      });

      return {
        transactions: processedTransactions,
        total,
        page,
        limit: isReport ? 1000 : limit,
        total_debit: totalDebit.toFixed(2),
        total_credit: totalCredit.toFixed(2),
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

  // Update transaction with details (items and expenses)
  static async update(
    id: string,
    updateData: UpdateTransactionWithDetailsDTO,
    clerkId: string
  ): Promise<TransactionResponse> {
    try {
      // Verify transaction exists
      const existingTransaction = await Transaction.findByPk(id);
      if (!existingTransaction) {
        throw new Error('Transaction not found');
      }

      // Verify supplier exists if being updated
      if (updateData.supplier_id) {
        const supplier = await Contact.findByPk(updateData.supplier_id);
        if (!supplier) {
          throw new Error('Supplier not found');
        }
      }

      // Verify customer exists if being updated
      if (updateData.customer_id) {
        const customer = await Contact.findByPk(updateData.customer_id);
        if (!customer) {
          throw new Error('Customer not found');
        }
      }

      // Use transaction to ensure data consistency
      await sequelize.transaction(async (t) => {
        // Update basic transaction fields
        const basicUpdateData = {
          supplier_id: updateData.supplier_id,
          customer_id: updateData.customer_id,
          type: updateData.type,
          transaction_date: updateData.transaction_date,
          notes: updateData.notes,
          updated_by: clerkId
        };

        await Transaction.update(basicUpdateData, {
          where: { id },
          transaction: t
        });

        // Handle transaction expenses
        if (updateData.transaction_expenses !== undefined) {
          if (updateData.transaction_expenses.length === 0) {
            // Delete ALL existing expenses for this transaction
            await TransactionExpense.destroy({
              where: { transaction_id: id },
              transaction: t
            });
          } else {
            // Get IDs of expenses that should be kept (have an ID in the update data)
            const expenseIdsToKeep = updateData.transaction_expenses
              .filter(expense => expense.id)
              .map(expense => expense.id);

            // Delete expenses that are not in the update data (removed items)
            if (expenseIdsToKeep.length > 0) {
              await TransactionExpense.destroy({
                where: {
                  transaction_id: id,
                  id: { [Op.notIn]: expenseIdsToKeep }
                },
                transaction: t
              });
            } else {
              // If no existing expenses to keep, delete all existing expenses
              await TransactionExpense.destroy({
                where: { transaction_id: id },
                transaction: t
              });
            }

            // Update or create transaction expenses
            for (const expense of updateData.transaction_expenses) {
              if (expense.id) {
                // Update existing expense
                await TransactionExpense.update({
                  expense_type_id: expense.expense_type,
                  amount: expense.amount,
                  notes: expense.notes,
                  subtotal: expense.amount,
                  updated_by: clerkId
                }, {
                  where: {
                    id: expense.id,
                    transaction_id: id
                  },
                  transaction: t
                });
              } else {
                // Create new expense
                await TransactionExpense.create({
                  transaction_id: id,
                  expense_type_id: expense.expense_type,
                  amount: expense.amount,
                  notes: expense.notes,
                  subtotal: expense.amount,
                  created_by: clerkId,
                  updated_by: clerkId
                }, { transaction: t });
              }
            }
          }
        }

        // Handle transaction items
        if (updateData.transaction_products !== undefined) {
          if (updateData.transaction_products.length === 0) {
            // Delete ALL existing items for this transaction
            await TransactionItem.destroy({
              where: { transaction_id: id },
              transaction: t
            });
          } else {
            // Get IDs of items that should be kept (have an ID in the update data)
            const itemIdsToKeep = updateData.transaction_products
              .filter(product => product.id)
              .map(product => product.id);

            // Delete items that are not in the update data (removed items)
            if (itemIdsToKeep.length > 0) {
              await TransactionItem.destroy({
                where: {
                  transaction_id: id,
                  id: { [Op.notIn]: itemIdsToKeep }
                },
                transaction: t
              });
            } else {
              // If no existing items to keep, delete all existing items
              await TransactionItem.destroy({
                where: { transaction_id: id },
                transaction: t
              });
            }

            // Update or create transaction items
            for (const product of updateData.transaction_products) {
              if (product.id) {
                // Update existing item
                await TransactionItem.update({
                  item_id: product.product_id,
                  unit_price: product.amount_per_product,
                  qty: product.quantity,
                  subtotal: product.sub_total,
                  updated_by: clerkId
                }, {
                  where: {
                    id: product.id,
                    transaction_id: id
                  },
                  transaction: t
                });
              } else {
                // Create new item
                await TransactionItem.create({
                  transaction_id: id,
                  item_id: product.product_id,
                  unit_price: product.amount_per_product,
                  qty: product.quantity,
                  subtotal: product.sub_total,
                  created_by: clerkId,
                  updated_by: clerkId
                }, { transaction: t });
              }
            }
          }
        }

        // Recalculate total based on updated items and expenses
        const totalItems = await TransactionItem.sum('subtotal', {
          where: { transaction_id: id },
          transaction: t
        }) || 0;

        const totalExpenses = await TransactionExpense.sum('amount', {
          where: { transaction_id: id },
          transaction: t
        }) || 0;

        const calculatedTotal = totalItems - totalExpenses;

        // Update transaction total
        await Transaction.update({
          total: calculatedTotal,
          updated_by: clerkId
        }, {
          where: { id },
          transaction: t
        });
      });

      // Return updated transaction
      return await this.findById(id) as TransactionResponse;
    } catch (error) {
      throw new Error(`Failed to update transaction: ${error}`);
    }
  }
}
