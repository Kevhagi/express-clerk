import { Router } from 'express';
import {
  getAllTransactionExpenses,
  getTransactionExpenseById,
  createTransactionExpense,
  updateTransactionExpense,
  deleteTransactionExpense,
} from '../controllers/transactionExpenseController.js';

const router = Router();

// GET /api/transaction-expenses - Get all transaction expenses
router.get('/', getAllTransactionExpenses);

// GET /api/transaction-expenses/:id - Get transaction expense by ID
router.get('/:id', getTransactionExpenseById);

// POST /api/transaction-expenses - Create new transaction expense
router.post('/', createTransactionExpense);

// PUT /api/transaction-expenses/:id - Update transaction expense
router.put('/:id', updateTransactionExpense);

// DELETE /api/transaction-expenses/:id - Delete transaction expense
router.delete('/:id', deleteTransactionExpense);

export default router;
