import { Brand } from '../models';
import { CreateBrandDTO, UpdateBrandDTO, IBrand } from '../types';

export class BrandService {
  // Create a new brand
  static async create(brandData: CreateBrandDTO): Promise<IBrand> {
    try {
      const brand = await Brand.create(brandData);
      return brand.toJSON();
    } catch (error) {
      throw new Error(`Failed to create brand: ${error}`);
    }
  }

  // Get all brands
  static async findAll(): Promise<IBrand[]> {
    try {
      const brands = await Brand.findAll();
      return brands.map(brand => brand.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch brands: ${error}`);
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
  static async update(id: string, brandData: UpdateBrandDTO): Promise<IBrand | null> {
    try {
      const brand = await Brand.findByPk(id);
      if (!brand) {
        return null;
      }
      
      await brand.update(brandData);
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

  // Check if brand exists
  static async exists(id: string): Promise<boolean> {
    try {
      const brand = await Brand.findByPk(id);
      return !!brand;
    } catch (error) {
      throw new Error(`Failed to check brand existence with ID ${id}: ${error}`);
    }
  }

  // Find brand by name (exact match)
  static async findByName(name: string): Promise<IBrand | null> {
    try {
      const brand = await Brand.findOne({
        where: { name }
      });
      return brand ? brand.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to find brand by name: ${error}`);
    }
  }

  // Get total count of brands
  static async count(): Promise<number> {
    try {
      return await Brand.count();
    } catch (error) {
      throw new Error(`Failed to count brands: ${error}`);
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
