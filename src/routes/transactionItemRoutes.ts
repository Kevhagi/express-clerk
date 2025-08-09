import { Router } from 'express';
import {
  getAllTransactionItems,
  getTransactionItemById,
  createTransactionItem,
  updateTransactionItem,
  deleteTransactionItem,
} from '../controllers/transactionItemController';

const router = Router();

// GET /api/transaction-items - Get all transaction items
router.get('/', getAllTransactionItems);

// GET /api/transaction-items/:id - Get transaction item by ID
router.get('/:id', getTransactionItemById);

// POST /api/transaction-items - Create new transaction item
router.post('/', createTransactionItem);

// PUT /api/transaction-items/:id - Update transaction item
router.put('/:id', updateTransactionItem);

// DELETE /api/transaction-items/:id - Delete transaction item
router.delete('/:id', deleteTransactionItem);

export default router;
