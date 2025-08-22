import { TransactionItem, Transaction, Item, Brand } from '../models';
import { ITransactionItem } from '../types';

export class TransactionItemService {


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












}
