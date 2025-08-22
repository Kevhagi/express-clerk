import { Router } from 'express';
import contactRoutes from './contactRoutes';
import brandRoutes from './brandRoutes';
import expenseTypeRoutes from './expenseTypeRoutes';
import itemRoutes from './itemRoutes';
import transactionRoutes from './transactionRoutes';
import transactionItemRoutes from './transactionItemRoutes';
import transactionExpenseRoutes from './transactionExpenseRoutes';
import dashboardRoutes from './dashboardRoutes';

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
