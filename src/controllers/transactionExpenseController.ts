import { Request, Response } from 'express';
import { TransactionExpense, Transaction, ExpenseType } from '../models/index.js';
import { TransactionExpenseService } from '../services/transactionExpenseService.js';
import { CreateTransactionExpenseDTO, UpdateTransactionExpenseDTO } from '../types/index.js';

// GET /api/transaction-expenses - Get all transaction expenses with related data
export const getAllTransactionExpenses = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { transaction_id, expense_type_id, transaction_type } = req.query;

    const result = await TransactionExpenseService.findWithPagination(
      page, 
      limit, 
      transaction_id as string,
      expense_type_id as string,
      transaction_type as string
    );

    res.json({
      data: result.transactionExpenses,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction expenses', details: error });
  }
};

// GET /api/transaction-expenses/:id - Get transaction expense by ID with related data
export const getTransactionExpenseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const transactionExpense = await TransactionExpense.findByPk(id, {
      include: [
        {
          model: Transaction,
          as: 'transaction',
          attributes: ['id', 'type', 'transaction_date'],
        },
        {
          model: ExpenseType,
          as: 'expenseType',
          attributes: ['id', 'name'],
        },
      ],
    });
    
    if (!transactionExpense) {
      res.status(404).json({ error: 'Transaction expense not found' });
      return;
    }
    
    res.json({
      data: transactionExpense
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction expense', details: error });
  }
};

// POST /api/transaction-expenses - Create new transaction expense
/* Sample request body:
{
  "transaction_id": 1,
  "expense_type_id": 2,
  "amount": 500000.00,
  "notes": "Shipping cost for bulk order",
  "subtotal": 500000.00
}
*/
export const createTransactionExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactionExpenseData: CreateTransactionExpenseDTO = req.body;
    
    // Verify transaction exists
    const transaction = await Transaction.findByPk(transactionExpenseData.transaction_id);
    if (!transaction) {
      res.status(400).json({ error: 'Transaction not found' });
      return;
    }
    
    // Verify expense type exists
    const expenseType = await ExpenseType.findByPk(transactionExpenseData.expense_type_id);
    if (!expenseType) {
      res.status(400).json({ error: 'Expense type not found' });
      return;
    }
    
    const transactionExpense = await TransactionExpense.create({
      ...transactionExpenseData,
      created_by: req.clerkId!,
      updated_by: req.clerkId!
    });
    const createdTransactionExpense = await TransactionExpense.findByPk(transactionExpense.id, {
      include: [
        {
          model: Transaction,
          as: 'transaction',
          attributes: ['id', 'type', 'transaction_date'],
        },
        {
          model: ExpenseType,
          as: 'expenseType',
          attributes: ['id', 'name'],
        },
      ],
    });
    
    res.status(201).json({
      data: createdTransactionExpense
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create transaction expense', details: error });
  }
};

// PUT /api/transaction-expenses/:id - Update transaction expense
/* Sample request body:
{
  "transaction_id": 1,
  "expense_type_id": 3,
  "amount": 750000.00,
  "notes": "Updated shipping and packaging cost",
  "subtotal": 750000.00
}
*/
export const updateTransactionExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateTransactionExpenseDTO = req.body;
    
    // Verify transaction exists if being updated
    if (updateData.transaction_id) {
      const transaction = await Transaction.findByPk(updateData.transaction_id);
      if (!transaction) {
        res.status(400).json({ error: 'Transaction not found' });
        return;
      }
    }
    
    // Verify expense type exists if being updated
    if (updateData.expense_type_id) {
      const expenseType = await ExpenseType.findByPk(updateData.expense_type_id);
      if (!expenseType) {
        res.status(400).json({ error: 'Expense type not found' });
        return;
      }
    }
    
    const [updatedRowsCount] = await TransactionExpense.update({
      ...updateData,
      updated_by: req.clerkId!
    }, {
      where: { id },
    });
    
    if (updatedRowsCount === 0) {
      res.status(404).json({ error: 'Transaction expense not found' });
      return;
    }
    
    const updatedTransactionExpense = await TransactionExpense.findByPk(id, {
      include: [
        {
          model: Transaction,
          as: 'transaction',
          attributes: ['id', 'type', 'transaction_date'],
        },
        {
          model: ExpenseType,
          as: 'expenseType',
          attributes: ['id', 'name'],
        },
      ],
    });
    
    res.json({
      data: updatedTransactionExpense
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update transaction expense', details: error });
  }
};

// DELETE /api/transaction-expenses/:id - Delete transaction expense
export const deleteTransactionExpense = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedRowsCount = await TransactionExpense.destroy({
      where: { id },
    });
    
    if (deletedRowsCount === 0) {
      res.status(404).json({ error: 'Transaction expense not found' });
      return;
    }
    
    res.status(200).json({ message: 'Transaction expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction expense', details: error });
  }
};
