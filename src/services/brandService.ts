import { Brand } from '../models/index.js';
import { CreateBrandDTO, UpdateBrandDTO, IBrand } from '../types/index.js';

export class BrandService {
  // Create a new brand
  static async create(brandData: CreateBrandDTO, clerkId: string): Promise<IBrand> {
    try {
      const brand = await Brand.create({
        ...brandData,
        created_by: clerkId,
        updated_by: clerkId
      });
      return brand.toJSON();
    } catch (error) {
      throw new Error(`Failed to create brand: ${error}`);
    }
  }



  // Get brand by ID
  static async findById(id: string): Promise<IBrand | null> {
    try {
      const brand = await Brand.findByPk(id);
      return brand ? brand.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to fetch brand with ID ${id}: ${error}`);
    }
  }

  // Update brand by ID
  static async update(id: string, brandData: UpdateBrandDTO, clerkId: string): Promise<IBrand | null> {
    try {
      const brand = await Brand.findByPk(id);
      if (!brand) {
        return null;
      }
      
      await brand.update({
        ...brandData,
        updated_by: clerkId
      });
      return brand.toJSON();
    } catch (error) {
      throw new Error(`Failed to update brand with ID ${id}: ${error}`);
    }
  }

  // Delete brand by ID
  static async delete(id: string): Promise<boolean> {
    try {
      const brand = await Brand.findByPk(id);
      if (!brand) {
        return false;
      }
      
      await brand.destroy();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete brand with ID ${id}: ${error}`);
    }
  }







  // Find brands with pagination
  static async findWithPagination(page: number, limit: number): Promise<{
    brands: IBrand[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const offset = (page - 1) * limit;
      
      // Get total count
      const total = await Brand.count();

      // Get brands with pagination
      const brands = await Brand.findAll({
        limit,
        offset,
        order: [['name', 'ASC']],
      });

      return {
        brands: brands.map(brand => brand.toJSON()),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new Error(`Failed to fetch brands with pagination: ${error}`);
    }
  }
}
