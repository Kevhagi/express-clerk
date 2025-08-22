import { Request, Response } from 'express';
import { TransactionService } from '../services/transactionService';
import { Transaction, Contact } from '../models';
import { CreateTransactionDTO, CreateTransactionPayloadDTO, UpdateTransactionDTO } from '../types';

// GET /api/transactions - Get all transactions with related data
export const getAllTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { type, supplier_id, customer_id, start_date, end_date } = req.query;

    const result = await TransactionService.findWithPagination(
      page, 
      limit, 
      type as string,
      supplier_id as string,
      customer_id as string,
      start_date as string,
      end_date as string
    );

    res.json({
      data: result.transactions,
      total: result.total,
      page: result.page,
      limit: result.limit,
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
  "transaction_date": "2024-01-15T10:30:00.000Z",
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
  "total": 18000000.00,
  "transaction_date": "2024-01-16T14:30:00.000Z",
  "notes": "Sale of smartphones"
}
*/
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateTransactionDTO = req.body;
    
    // Add audit field from clerk ID
    const updateDataWithAudit = {
      ...updateData,
      updated_by: req.clerkId!
    };
    
    // Verify supplier exists if being updated
    if (updateData.supplier_id) {
      const supplier = await Contact.findByPk(updateData.supplier_id);
      if (!supplier) {
        res.status(400).json({ error: 'Supplier not found' });
        return;
      }
    }
    
    // Verify customer exists if being updated
    if (updateData.customer_id) {
      const customer = await Contact.findByPk(updateData.customer_id);
      if (!customer) {
        res.status(400).json({ error: 'Customer not found' });
        return;
      }
    }
    
    const [updatedRowsCount] = await Transaction.update(updateDataWithAudit, {
      where: { id },
    });
    
    if (updatedRowsCount === 0) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    
    const updatedTransaction = await Transaction.findByPk(id, {
      include: [
        {
          model: Contact,
          as: 'supplier',
          attributes: ['id', 'name', 'phone'],
        },
        {
          model: Contact,
          as: 'customer',
          attributes: ['id', 'name', 'phone'],
        },
      ],
    });
    
    res.json({
      data: updatedTransaction
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update transaction', details: error });
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
