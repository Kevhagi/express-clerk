import { TransactionExpense, Transaction, ExpenseType } from '../models/index.js';
import { ITransactionExpense } from '../types/index.js';

export class TransactionExpenseService {


  // Find transaction expenses with pagination and optional filters
  static async findWithPagination(
    page: number, 
    limit: number, 
    transactionId?: string,
    expenseTypeId?: string,
    transactionType?: string
  ): Promise<{
    transactionExpenses: ITransactionExpense[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const offset = (page - 1) * limit;
      
      // Build where clause conditionally
      const whereClause: any = {};
      
      if (transactionId) {
        whereClause.transaction_id = transactionId;
      }
      
      if (expenseTypeId) {
        whereClause.expense_type_id = expenseTypeId;
      }

      // Get total count with same filters
      const total = await TransactionExpense.count({
        where: whereClause,
      });

      // Get transaction expenses with pagination and optional filters
      const transactionExpenses = await TransactionExpense.findAll({
        include: [
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'type', 'transaction_date'],
            where: transactionType ? { type: transactionType } : undefined
          },
          {
            model: ExpenseType,
            as: 'expenseType',
            attributes: ['id', 'name']
          }
        ],
        where: whereClause,
        order: [['created_at', 'DESC']],
        limit,
        offset,
      });

      return {
        transactionExpenses: transactionExpenses.map(transactionExpense => transactionExpense.toJSON()),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new Error(`Failed to fetch transaction expenses with pagination: ${error}`);
    }
  }












}
