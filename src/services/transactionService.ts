import { Transaction, Contact } from '../models';
import { CreateTransactionDTO, UpdateTransactionDTO, ITransaction, TransactionType } from '../types';

export class TransactionService {
  // Create a new transaction
  static async create(transactionData: CreateTransactionDTO): Promise<ITransaction> {
    try {
      const transaction = await Transaction.create(transactionData);
      return transaction.toJSON();
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error}`);
    }
  }

  // Get all transactions
  static async findAll(): Promise<ITransaction[]> {
    try {
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
          }
        ],
        order: [['transaction_date', 'DESC']]
      });
      return transactions.map(transaction => transaction.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error}`);
    }
  }

  // Get transaction by ID
  static async findById(id: string): Promise<ITransaction | null> {
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
          }
        ]
      });
      return transaction ? transaction.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to fetch transaction with ID ${id}: ${error}`);
    }
  }

  // Update transaction by ID
  static async update(id: string, transactionData: UpdateTransactionDTO): Promise<ITransaction | null> {
    try {
      const transaction = await Transaction.findByPk(id);
      if (!transaction) {
        return null;
      }
      
      await transaction.update(transactionData);
      const updatedTransaction = await Transaction.findByPk(id, {
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
          }
        ]
      });
      return updatedTransaction ? updatedTransaction.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to update transaction with ID ${id}: ${error}`);
    }
  }

  // Delete transaction by ID
  static async delete(id: string): Promise<boolean> {
    try {
      const transaction = await Transaction.findByPk(id);
      if (!transaction) {
        return false;
      }
      
      await transaction.destroy();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete transaction with ID ${id}: ${error}`);
    }
  }

  // Check if transaction exists
  static async exists(id: string): Promise<boolean> {
    try {
      const transaction = await Transaction.findByPk(id);
      return !!transaction;
    } catch (error) {
      throw new Error(`Failed to check transaction existence with ID ${id}: ${error}`);
    }
  }

  // Find transactions by type
  static async findByType(type: TransactionType): Promise<ITransaction[]> {
    try {
      const transactions = await Transaction.findAll({
        where: { type },
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
          }
        ],
        order: [['transaction_date', 'DESC']]
      });
      return transactions.map(transaction => transaction.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch transactions by type ${type}: ${error}`);
    }
  }

  // Find transactions by user ID
  // Removed findByUserId: user_id dropped from Transaction

  // Find transactions by date range
  static async findByDateRange(startDate: Date, endDate: Date): Promise<ITransaction[]> {
    try {
      const transactions = await Transaction.findAll({
        where: {
          transaction_date: {
            [require('sequelize').Op.between]: [startDate, endDate]
          }
        },
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
          }
        ],
        order: [['transaction_date', 'DESC']]
      });
      return transactions.map(transaction => transaction.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch transactions by date range: ${error}`);
    }
  }
}
