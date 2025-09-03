import { Request, Response } from 'express';
import { TransactionService } from '../services/transactionService';
import { Transaction } from '../models';
import { CreateTransactionPayloadDTO, UpdateTransactionWithDetailsDTO } from '../types';

// GET /api/transactions - Get all transactions with related data
// Query parameters:
// - page: number (default: 1)
// - limit: number (default: 10)
// - type: 'buy' | 'sell'
// - contact_id: string (supplier_id for buy, customer_id for sell)
// - start_date: string (YYYY-MM-DD)
// - end_date: string (YYYY-MM-DD)
// - is_report: string (default: false) - if 'true', returns full detailed data with accurate totals; if false, returns summary data
// Response includes total_debit (sell transactions) and total_credit (buy transactions + expenses)
export const getAllTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { type, contact_id, start_date, end_date, is_report } = req.query;

    // Handle contact_id parameter from frontend
    let finalSupplierId: string | undefined;
    let finalCustomerId: string | undefined;

    if (contact_id) {
      if (type === 'buy') {
        finalSupplierId = contact_id as string;
      } else if (type === 'sell') {
        finalCustomerId = contact_id as string;
      }
    }

    const result = await TransactionService.findWithPagination(
      page, 
      limit, 
      type as string,
      finalSupplierId,
      finalCustomerId,
      start_date as string,
      end_date as string,
      Boolean(is_report)
    );

    res.json({
      data: result.transactions,
      total: result.total,
      page: result.page,
      limit: result.limit,
      total_debit: result.total_debit,
      total_credit: result.total_credit,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions', details: error });
  }
};

// GET /api/transactions/:id - Get transaction by ID with related data
export const getTransactionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const transaction = await TransactionService.findById(id);
    
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    
    res.json({
      data: transaction
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction', details: error });
  }
};

// POST /api/transactions - Create new transaction
/* Sample request body:
{
  "supplier_id": 2,
  "customer_id": null,
  "type": "buy",
  "total": 15000000.00,
  "transaction_date": "2024-01-15",
  "notes": "Purchase of smartphones for inventory"
}
*/
export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactionData: CreateTransactionPayloadDTO = req.body;
    const createdTransaction = await TransactionService.create(transactionData, req.clerkId!);
    res.status(201).json({
      data: createdTransaction
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Failed to create transaction', details: error });
    }
  }
};

// PUT /api/transactions/:id - Update transaction
/* Sample request body:
{
  "supplier_id": 3,
  "customer_id": 1,
  "type": "sell",
  "transaction_date": "2024-01-16",
  "notes": "Sale of smartphones",
  "transaction_products": [
    {
      "id": "existing-item-id", // Optional: if provided, updates existing item
      "product_id": "product-uuid",
      "quantity": 2,
      "amount_per_product": 9000000,
      "sub_total": 18000000
    }
  ],
  "transaction_expenses": [
    {
      "id": "existing-expense-id", // Optional: if provided, updates existing expense
      "expense_type": "expense-type-uuid",
      "amount": 500000,
      "notes": "Shipping cost"
    }
  ]
}
*/
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateTransactionWithDetailsDTO = req.body;
    
    const updatedTransaction = await TransactionService.update(id, updateData, req.clerkId!);
    
    res.json({
      data: updatedTransaction
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'Failed to update transaction', details: error });
    }
  }
};

// DELETE /api/transactions/:id - Delete transaction
export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedRowsCount = await Transaction.destroy({
      where: { id },
    });
    
    if (deletedRowsCount === 0) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction', details: error });
  }
};
