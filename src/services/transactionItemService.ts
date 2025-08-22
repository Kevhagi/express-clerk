import { TransactionItem, Transaction, Item, Brand } from '../models';
import { CreateTransactionItemDTO, UpdateTransactionItemDTO, ITransactionItem } from '../types';
import { Op } from 'sequelize';

export class TransactionItemService {
  // Create a new transaction item
  static async create(transactionItemData: CreateTransactionItemDTO): Promise<ITransactionItem> {
    try {
      const transactionItem = await TransactionItem.create(transactionItemData);
      return transactionItem.toJSON();
    } catch (error) {
      throw new Error(`Failed to create transaction item: ${error}`);
    }
  }

  // Get all transaction items
  static async findAll(): Promise<ITransactionItem[]> {
    try {
      const transactionItems = await TransactionItem.findAll({
        include: [
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'type', 'transaction_date']
          },
          {
            model: Item,
            as: 'item',
            include: [
              {
                model: Brand,
                as: 'brand',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });
      return transactionItems.map(transactionItem => transactionItem.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch transaction items: ${error}`);
    }
  }

  // Find transaction items with pagination and optional filters
  static async findWithPagination(
    page: number, 
    limit: number, 
    transactionId?: string,
    itemId?: string,
    transactionType?: string
  ): Promise<{
    transactionItems: ITransactionItem[];
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
      
      if (itemId) {
        whereClause.item_id = itemId;
      }

      // Get total count with same filters
      const total = await TransactionItem.count({
        where: whereClause,
      });

      // Get transaction items with pagination and optional filters
      const transactionItems = await TransactionItem.findAll({
        include: [
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'type', 'transaction_date'],
            where: transactionType ? { type: transactionType } : undefined
          },
          {
            model: Item,
            as: 'item',
            include: [
              {
                model: Brand,
                as: 'brand',
                attributes: ['id', 'name']
              }
            ]
          }
        ],
        where: whereClause,
        order: [['created_at', 'DESC']],
        limit,
        offset,
      });

      return {
        transactionItems: transactionItems.map(transactionItem => transactionItem.toJSON()),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new Error(`Failed to fetch transaction items with pagination: ${error}`);
    }
  }

  // Get transaction item by ID
  static async findById(id: string): Promise<ITransactionItem | null> {
    try {
      const transactionItem = await TransactionItem.findByPk(id, {
        include: [
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'type', 'transaction_date']
          },
          {
            model: Item,
            as: 'item',
            include: [
              {
                model: Brand,
                as: 'brand',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });
      return transactionItem ? transactionItem.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to fetch transaction item with ID ${id}: ${error}`);
    }
  }

  // Update transaction item by ID
  static async update(id: string, transactionItemData: UpdateTransactionItemDTO): Promise<ITransactionItem | null> {
    try {
      const transactionItem = await TransactionItem.findByPk(id);
      if (!transactionItem) {
        return null;
      }
      
      await transactionItem.update(transactionItemData);
      const updatedTransactionItem = await TransactionItem.findByPk(id, {
        include: [
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'type', 'transaction_date']
          },
          {
            model: Item,
            as: 'item',
            include: [
              {
                model: Brand,
                as: 'brand',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });
      return updatedTransactionItem ? updatedTransactionItem.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to update transaction item with ID ${id}: ${error}`);
    }
  }

  // Delete transaction item by ID
  static async delete(id: string): Promise<boolean> {
    try {
      const transactionItem = await TransactionItem.findByPk(id);
      if (!transactionItem) {
        return false;
      }
      
      await transactionItem.destroy();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete transaction item with ID ${id}: ${error}`);
    }
  }

  // Check if transaction item exists
  static async exists(id: string): Promise<boolean> {
    try {
      const transactionItem = await TransactionItem.findByPk(id);
      return !!transactionItem;
    } catch (error) {
      throw new Error(`Failed to check transaction item existence with ID ${id}: ${error}`);
    }
  }

  // Find transaction items by transaction ID
  static async findByTransactionId(transactionId: string): Promise<ITransactionItem[]> {
    try {
      const transactionItems = await TransactionItem.findAll({
        where: { transaction_id: transactionId },
        include: [
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'type', 'transaction_date']
          },
          {
            model: Item,
            as: 'item',
            include: [
              {
                model: Brand,
                as: 'brand',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });
      return transactionItems.map(transactionItem => transactionItem.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch transaction items by transaction ID ${transactionId}: ${error}`);
    }
  }

  // Find transaction items by item ID
  static async findByItemId(itemId: string): Promise<ITransactionItem[]> {
    try {
      const transactionItems = await TransactionItem.findAll({
        where: { item_id: itemId },
        include: [
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'type', 'transaction_date']
          },
          {
            model: Item,
            as: 'item',
            include: [
              {
                model: Brand,
                as: 'brand',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      });
      return transactionItems.map(transactionItem => transactionItem.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch transaction items by item ID ${itemId}: ${error}`);
    }
  }
}
