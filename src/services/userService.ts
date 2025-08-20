import { User } from '../models';
import { CreateUserDTO, UpdateUserDTO, IUser } from '../types';

export class UserService {
  // Create a new user
  static async create(userData: CreateUserDTO, clerkId: string): Promise<IUser> {
    try {
      const user = await User.create({
        ...userData,
        createdBy: clerkId,
        updatedBy: clerkId
      });
      return user.toJSON();
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  // Get all users
  static async findAll(): Promise<IUser[]> {
    try {
      const users = await User.findAll();
      return users.map(user => user.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error}`);
    }
  }

  // Get user by ID
  static async findById(id: string): Promise<IUser | null> {
    try {
      const user = await User.findByPk(id);
      return user ? user.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to fetch user with ID ${id}: ${error}`);
    }
  }

  // Update user by ID
  static async update(id: string, userData: UpdateUserDTO, clerkId: string): Promise<IUser | null> {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return null;
      }
      
      await user.update({
        ...userData,
        updatedBy: clerkId
      });
      return user.toJSON();
    } catch (error) {
      throw new Error(`Failed to update user with ID ${id}: ${error}`);
    }
  }

  // Delete user by ID
  static async delete(id: string): Promise<boolean> {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return false;
      }
      
      await user.destroy();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user with ID ${id}: ${error}`);
    }
  }

  // Check if user exists
  static async exists(id: string): Promise<boolean> {
    try {
      const user = await User.findByPk(id);
      return !!user;
    } catch (error) {
      throw new Error(`Failed to check user existence with ID ${id}: ${error}`);
    }
  }
}
