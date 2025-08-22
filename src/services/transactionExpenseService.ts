import { TransactionExpense, Transaction, ExpenseType } from '../models';
import { CreateTransactionExpenseDTO, UpdateTransactionExpenseDTO, ITransactionExpense } from '../types';
import { Op } from 'sequelize';

export class TransactionExpenseService {
  // Create a new transaction expense
  static async create(transactionExpenseData: CreateTransactionExpenseDTO): Promise<ITransactionExpense> {
    try {
      const transactionExpense = await TransactionExpense.create(transactionExpenseData);
      return transactionExpense.toJSON();
    } catch (error) {
      throw new Error(`Failed to create transaction expense: ${error}`);
    }
  }

  // Get all transaction expenses
  static async findAll(): Promise<ITransactionExpense[]> {
    try {
      const transactionExpenses = await TransactionExpense.findAll({
        include: [
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'type', 'transaction_date']
          },
          {
            model: ExpenseType,
            as: 'expenseType',
            attributes: ['id', 'name']
          }
        ]
      });
      return transactionExpenses.map(transactionExpense => transactionExpense.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch transaction expenses: ${error}`);
    }
  }

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

  // Get transaction expense by ID
  static async findById(id: string): Promise<ITransactionExpense | null> {
    try {
      const transactionExpense = await TransactionExpense.findByPk(id, {
        include: [
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'type', 'transaction_date']
          },
          {
            model: ExpenseType,
            as: 'expenseType',
            attributes: ['id', 'name']
          }
        ]
      });
      return transactionExpense ? transactionExpense.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to fetch transaction expense with ID ${id}: ${error}`);
    }
  }

  // Update transaction expense by ID
  static async update(id: string, transactionExpenseData: UpdateTransactionExpenseDTO): Promise<ITransactionExpense | null> {
    try {
      const transactionExpense = await TransactionExpense.findByPk(id);
      if (!transactionExpense) {
        return null;
      }
      
      await transactionExpense.update(transactionExpenseData);
      const updatedTransactionExpense = await TransactionExpense.findByPk(id, {
        include: [
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'type', 'transaction_date']
          },
          {
            model: ExpenseType,
            as: 'expenseType',
            attributes: ['id', 'name']
          }
        ]
      });
      return updatedTransactionExpense ? updatedTransactionExpense.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to update transaction expense with ID ${id}: ${error}`);
    }
  }

  // Delete transaction expense by ID
  static async delete(id: string): Promise<boolean> {
    try {
      const transactionExpense = await TransactionExpense.findByPk(id);
      if (!transactionExpense) {
        return false;
      }
      
      await transactionExpense.destroy();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete transaction expense with ID ${id}: ${error}`);
    }
  }

  // Check if transaction expense exists
  static async exists(id: string): Promise<boolean> {
    try {
      const transactionExpense = await TransactionExpense.findByPk(id);
      return !!transactionExpense;
    } catch (error) {
      throw new Error(`Failed to check transaction expense existence with ID ${id}: ${error}`);
    }
  }

  // Find transaction expenses by transaction ID
  static async findByTransactionId(transactionId: string): Promise<ITransactionExpense[]> {
    try {
      const transactionExpenses = await TransactionExpense.findAll({
        where: { transaction_id: transactionId },
        include: [
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'type', 'transaction_date']
          },
          {
            model: ExpenseType,
            as: 'expenseType',
            attributes: ['id', 'name']
          }
        ]
      });
      return transactionExpenses.map(transactionExpense => transactionExpense.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch transaction expenses by transaction ID ${transactionId}: ${error}`);
    }
  }

  // Find transaction expenses by expense type ID
  static async findByExpenseTypeId(expenseTypeId: string): Promise<ITransactionExpense[]> {
    try {
      const transactionExpenses = await TransactionExpense.findAll({
        where: { expense_type_id: expenseTypeId },
        include: [
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'type', 'transaction_date']
          },
          {
            model: ExpenseType,
            as: 'expenseType',
            attributes: ['id', 'name']
          }
        ]
      });
      return transactionExpenses.map(transactionExpense => transactionExpense.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch transaction expenses by expense type ID ${expenseTypeId}: ${error}`);
    }
  }
}
