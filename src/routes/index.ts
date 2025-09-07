import { Router } from 'express';
import contactRoutes from './contactRoutes.js';
import brandRoutes from './brandRoutes.js';
import expenseTypeRoutes from './expenseTypeRoutes.js';
import itemRoutes from './itemRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import transactionItemRoutes from './transactionItemRoutes.js';
import transactionExpenseRoutes from './transactionExpenseRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

// Mount all routes
router.use('/contacts', contactRoutes);
router.use('/brands', brandRoutes);
router.use('/expense-types', expenseTypeRoutes);
router.use('/items', itemRoutes);
router.use('/transactions', transactionRoutes);
router.use('/transaction-items', transactionItemRoutes);
router.use('/transaction-expenses', transactionExpenseRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
