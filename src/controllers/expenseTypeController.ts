import { Request, Response } from 'express';
import { ExpenseType } from '../models';
import { CreateExpenseTypeDTO, UpdateExpenseTypeDTO } from '../types';

// GET /api/expense-types - Get all expense types
export const getAllExpenseTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenseTypes = await ExpenseType.findAll();
    res.json(expenseTypes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expense types', details: error });
  }
};

// GET /api/expense-types/:id - Get expense type by ID
export const getExpenseTypeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const expenseType = await ExpenseType.findByPk(id);
    
    if (!expenseType) {
      res.status(404).json({ error: 'Expense type not found' });
      return;
    }
    
    res.json(expenseType);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expense type', details: error });
  }
};

// POST /api/expense-types - Create new expense type
/* Sample request body:
{
  "name": "Shipping"
}
*/
export const createExpenseType = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenseTypeData: CreateExpenseTypeDTO = req.body;
    const expenseType = await ExpenseType.create(expenseTypeData);
    res.status(201).json(expenseType);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create expense type', details: error });
  }
};

// PUT /api/expense-types/:id - Update expense type
/* Sample request body:
{
  "name": "Packaging"
}
*/
export const updateExpenseType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateExpenseTypeDTO = req.body;
    
    const [updatedRowsCount] = await ExpenseType.update(updateData, {
      where: { id },
    });
    
    if (updatedRowsCount === 0) {
      res.status(404).json({ error: 'Expense type not found' });
      return;
    }
    
    const updatedExpenseType = await ExpenseType.findByPk(id);
    res.json(updatedExpenseType);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update expense type', details: error });
  }
};

// DELETE /api/expense-types/:id - Delete expense type
export const deleteExpenseType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedRowsCount = await ExpenseType.destroy({
      where: { id },
    });
    
    if (deletedRowsCount === 0) {
      res.status(404).json({ error: 'Expense type not found' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense type', details: error });
  }
};
