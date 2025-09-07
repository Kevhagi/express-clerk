import { Request, Response } from 'express';
import { TransactionItem, Transaction, Item, Brand } from '../models/index.js';
import { TransactionItemService } from '../services/transactionItemService';
import { CreateTransactionItemDTO, UpdateTransactionItemDTO } from '../types/index.js';

// GET /api/transaction-items - Get all transaction items with related data
export const getAllTransactionItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { transaction_id, item_id, transaction_type } = req.query;

    const result = await TransactionItemService.findWithPagination(
      page, 
      limit, 
      transaction_id as string,
      item_id as string,
      transaction_type as string
    );

    res.json({
      data: result.transactionItems,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction items', details: error });
  }
};

// GET /api/transaction-items/:id - Get transaction item by ID with related data
export const getTransactionItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const transactionItem = await TransactionItem.findByPk(id, {
      include: [
        {
          model: Transaction,
          as: 'transaction',
          attributes: ['id', 'type', 'transaction_date'],
        },
        {
          model: Item,
          as: 'item',
          include: [
            {
              model: Brand,
              as: 'brand',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });
    
    if (!transactionItem) {
      res.status(404).json({ error: 'Transaction item not found' });
      return;
    }
    
    res.json({
      data: transactionItem
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction item', details: error });
  }
};

// POST /api/transaction-items - Create new transaction item
/* Sample request body:
{
  "transaction_id": "transaction-uuid",
  "item_id": "item-uuid",
  "unit_price": 12000000.00,
  "qty": 2,
  "subtotal": 24000000.00
}
*/
export const createTransactionItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactionItemData: CreateTransactionItemDTO = req.body;
    
    // Verify transaction exists
    const transaction = await Transaction.findByPk(transactionItemData.transaction_id);
    if (!transaction) {
      res.status(400).json({ error: 'Transaction not found' });
      return;
    }
    
    // Verify item exists
    const item = await Item.findByPk(transactionItemData.item_id);
    if (!item) {
      res.status(400).json({ error: 'Item not found' });
      return;
    }
    
    const transactionItem = await TransactionItem.create({
      ...transactionItemData,
      created_by: req.clerkId!,
      updated_by: req.clerkId!
    });
    const createdTransactionItem = await TransactionItem.findByPk(transactionItem.id, {
      include: [
        {
          model: Transaction,
          as: 'transaction',
          attributes: ['id', 'type', 'transaction_date'],
        },
        {
          model: Item,
          as: 'item',
          include: [
            {
              model: Brand,
              as: 'brand',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });
    
    res.status(201).json({
      data: createdTransactionItem
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create transaction item', details: error });
  }
};

// PUT /api/transaction-items/:id - Update transaction item
/* Sample request body:
{
  "transaction_id": "transaction-uuid",
  "item_id": "item-uuid",
  "unit_price": 13000000.00,
  "qty": 3,
  "subtotal": 39000000.00
}
*/
export const updateTransactionItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateTransactionItemDTO = req.body;
    
    // Verify transaction exists if being updated
    if (updateData.transaction_id) {
      const transaction = await Transaction.findByPk(updateData.transaction_id);
      if (!transaction) {
        res.status(400).json({ error: 'Transaction not found' });
        return;
      }
    }
    
    // Verify item exists if being updated
    if (updateData.item_id) {
      const item = await Item.findByPk(updateData.item_id);
      if (!item) {
        res.status(400).json({ error: 'Item not found' });
        return;
      }
    }
    
    const [updatedRowsCount] = await TransactionItem.update({
      ...updateData,
      updated_by: req.clerkId!
    }, {
      where: { id },
    });
    
    if (updatedRowsCount === 0) {
      res.status(404).json({ error: 'Transaction item not found' });
      return;
    }
    
    const updatedTransactionItem = await TransactionItem.findByPk(id, {
      include: [
        {
          model: Transaction,
          as: 'transaction',
          attributes: ['id', 'type', 'transaction_date'],
        },
        {
          model: Item,
          as: 'item',
          include: [
            {
              model: Brand,
              as: 'brand',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });
    
    res.json({
      data: updatedTransactionItem
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update transaction item', details: error });
  }
};

// DELETE /api/transaction-items/:id - Delete transaction item
export const deleteTransactionItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedRowsCount = await TransactionItem.destroy({
      where: { id },
    });
    
    if (deletedRowsCount === 0) {
      res.status(404).json({ error: 'Transaction item not found' });
      return;
    }
    
    res.status(200).json({ message: 'Transaction item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction item', details: error });
  }
};
