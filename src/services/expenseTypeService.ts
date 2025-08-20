import { ExpenseType } from '../models';
import { CreateExpenseTypeDTO, UpdateExpenseTypeDTO, IExpenseType } from '../types';

export class ExpenseTypeService {
  // Create a new expense type
  static async create(expenseTypeData: CreateExpenseTypeDTO, clerkId: string): Promise<IExpenseType> {
    try {
      const expenseType = await ExpenseType.create({
        ...expenseTypeData,
        created_by: clerkId,
        updated_by: clerkId
      });
      return expenseType.toJSON();
    } catch (error) {
      throw new Error(`Failed to create expense type: ${error}`);
    }
  }

  // Get all expense types
  static async findAll(): Promise<IExpenseType[]> {
    try {
      const expenseTypes = await ExpenseType.findAll();
      return expenseTypes.map(expenseType => expenseType.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch expense types: ${error}`);
    }
  }

  // Get expense type by ID
  static async findById(id: string): Promise<IExpenseType | null> {
    try {
      const expenseType = await ExpenseType.findByPk(id);
      return expenseType ? expenseType.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to fetch expense type with ID ${id}: ${error}`);
    }
  }

  // Update expense type by ID
  static async update(id: string, expenseTypeData: UpdateExpenseTypeDTO, clerkId: string): Promise<IExpenseType | null> {
    try {
      const expenseType = await ExpenseType.findByPk(id);
      if (!expenseType) {
        return null;
      }
      
      await expenseType.update({
        ...expenseTypeData,
        updated_by: clerkId
      });
      return expenseType.toJSON();
    } catch (error) {
      throw new Error(`Failed to update expense type with ID ${id}: ${error}`);
    }
  }

  // Delete expense type by ID
  static async delete(id: string): Promise<boolean> {
    try {
      const expenseType = await ExpenseType.findByPk(id);
      if (!expenseType) {
        return false;
      }
      
      await expenseType.destroy();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete expense type with ID ${id}: ${error}`);
    }
  }

  // Check if expense type exists
  static async exists(id: string): Promise<boolean> {
    try {
      const expenseType = await ExpenseType.findByPk(id);
      return !!expenseType;
    } catch (error) {
      throw new Error(`Failed to check expense type existence with ID ${id}: ${error}`);
    }
  }

  // Find expense type by name (exact match)
  static async findByName(name: string): Promise<IExpenseType | null> {
    try {
      const expenseType = await ExpenseType.findOne({
        where: { name }
      });
      return expenseType ? expenseType.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find expense type by name: ${error}`);
    }
  }
}
