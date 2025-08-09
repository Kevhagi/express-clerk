import { Request, Response } from 'express';
import { User } from '../models';
import { CreateUserDTO, UpdateUserDTO } from '../types';

// GET /api/users - Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error });
  }
};

// GET /api/users/:id - Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', details: error });
  }
};

// POST /api/users - Create new user
/* Sample request body:
{
  "firstName": "John",
  "lastName": "Doe"
}
*/
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: CreateUserDTO = req.body;
    const user = await User.create(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user', details: error });
  }
};

// PUT /api/users/:id - Update user
/* Sample request body:
{
  "firstName": "Jane",
  "lastName": "Smith"
}
*/
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateUserDTO = req.body;
    
    const [updatedRowsCount] = await User.update(updateData, {
      where: { id },
    });
    
    if (updatedRowsCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    const updatedUser = await User.findByPk(id);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update user', details: error });
  }
};

// DELETE /api/users/:id - Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedRowsCount = await User.destroy({
      where: { id },
    });
    
    if (deletedRowsCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error });
  }
};
