import { Request, Response } from 'express';
import { ExpenseTypeService } from '../services/index.js';
import { CreateExpenseTypeDTO, UpdateExpenseTypeDTO } from '../types/index.js';

// GET /api/expense-types - Get all expense types
export const getAllExpenseTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const expenseTypes = await ExpenseTypeService.findAll();
    res.json({
      data: expenseTypes
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expense types', details: error });
  }
};

// GET /api/expense-types/:id - Get expense type by ID
export const getExpenseTypeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const expenseType = await ExpenseTypeService.findById(id);
    
    if (!expenseType) {
      res.status(404).json({ error: 'Expense type not found' });
      return;
    }
    
    res.json({
      data: expenseType
    });
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
    const expenseType = await ExpenseTypeService.create(expenseTypeData, req.clerkId!);
    res.status(201).json({
      data: expenseType
    });
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
    
    const updatedExpenseType = await ExpenseTypeService.update(id, updateData, req.clerkId!);
    if (!updatedExpenseType) {
      res.status(404).json({ error: 'Expense type not found' });
      return;
    }
    
    res.json({
      data: updatedExpenseType
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update expense type', details: error });
  }
};

// DELETE /api/expense-types/:id - Delete expense type
export const deleteExpenseType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if expense type exists before attempting to delete
    const existingExpenseType = await ExpenseTypeService.findById(id);
    if (!existingExpenseType) {
      res.status(404).json({ error: 'Expense type not found' });
      return;
    }
    
    // Delete expense type using service
    const deleted = await ExpenseTypeService.delete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Expense type not found' });
      return;
    }
    
    res.status(200).json({ message: 'Expense type deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense type', details: error });
  }
};
