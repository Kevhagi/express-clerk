import { Request, Response } from 'express';
import { Transaction, User, Contact, TransactionItem, TransactionExpense, Item, Brand, ExpenseType } from '../models';
import { CreateTransactionDTO, UpdateTransactionDTO } from '../types';

// GET /api/transactions - Get all transactions with related data
export const getAllTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
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
        {
          model: TransactionItem,
          as: 'transactionItems',
          include: [
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
        },
        {
          model: TransactionExpense,
          as: 'transactionExpenses',
          include: [
            {
              model: ExpenseType,
              as: 'expenseType',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions', details: error });
  }
};

// GET /api/transactions/:id - Get transaction by ID with related data
export const getTransactionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
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
        {
          model: TransactionItem,
          as: 'transactionItems',
          include: [
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
        },
        {
          model: TransactionExpense,
          as: 'transactionExpenses',
          include: [
            {
              model: ExpenseType,
              as: 'expenseType',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });
    
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction', details: error });
  }
};

// POST /api/transactions - Create new transaction
/* Sample request body:
{
  "user_id": 1,
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
    const transactionData: CreateTransactionDTO = req.body;
    
    // Add audit fields from clerk ID
    const transactionWithAudit = {
      ...transactionData,
      created_by: req.clerkId!,
      updated_by: req.clerkId!
    };
    
    // Verify user exists
    const user = await User.findByPk(transactionData.user_id);
    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }
    
    // Verify supplier exists if provided
    if (transactionData.supplier_id) {
      const supplier = await Contact.findByPk(transactionData.supplier_id);
      if (!supplier) {
        res.status(400).json({ error: 'Supplier not found' });
        return;
      }
    }
    
    // Verify customer exists if provided
    if (transactionData.customer_id) {
      const customer = await Contact.findByPk(transactionData.customer_id);
      if (!customer) {
        res.status(400).json({ error: 'Customer not found' });
        return;
      }
    }
    
    const transaction = await Transaction.create(transactionWithAudit);
    const createdTransaction = await Transaction.findByPk(transaction.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
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
    
    res.status(201).json(createdTransaction);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create transaction', details: error });
  }
};

// PUT /api/transactions/:id - Update transaction
/* Sample request body:
{
  "user_id": 1,
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
    
    // Verify user exists if being updated
    if (updateData.user_id) {
      const user = await User.findByPk(updateData.user_id);
      if (!user) {
        res.status(400).json({ error: 'User not found' });
        return;
      }
    }
    
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
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName'],
        },
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
    
    res.json(updatedTransaction);
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
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transaction', details: error });
  }
};
