import { Router } from 'express';
import {
  getAllExpenseTypes,
  getExpenseTypeById,
  createExpenseType,
  updateExpenseType,
  deleteExpenseType,
} from '../controllers/expenseTypeController';

const router = Router();

// GET /api/expense-types - Get all expense types
router.get('/', getAllExpenseTypes);

// GET /api/expense-types/:id - Get expense type by ID
router.get('/:id', getExpenseTypeById);

// POST /api/expense-types - Create new expense type
router.post('/', createExpenseType);

// PUT /api/expense-types/:id - Update expense type
router.put('/:id', updateExpenseType);

// DELETE /api/expense-types/:id - Delete expense type
router.delete('/:id', deleteExpenseType);

export default router;
