import { Item, Brand } from '../models';
import { CreateItemDTO, UpdateItemDTO, IItem } from '../types';
import { Op } from 'sequelize';

export class ItemService {
  // Create a new item
  static async create(itemData: CreateItemDTO): Promise<IItem> {
    try {
      const item = await Item.create(itemData);
      return item.toJSON();
    } catch (error) {
      throw new Error(`Failed to create item: ${error}`);
    }
  }

  // Get all items
  static async findAll(): Promise<IItem[]> {
    try {
      const items = await Item.findAll({
        include: [
          {
            model: Brand,
            as: 'brand',
            attributes: ['id', 'name']
          }
        ]
      });
      return items.map(item => item.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch items: ${error}`);
    }
  }

  // Get item by ID
  static async findById(id: string): Promise<IItem | null> {
    try {
      const item = await Item.findByPk(id, {
        include: [
          {
            model: Brand,
            as: 'brand',
            attributes: ['id', 'name']
          }
        ]
      });
      return item ? item.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to fetch item with ID ${id}: ${error}`);
    }
  }

  // Update item by ID
  static async update(id: string, itemData: UpdateItemDTO): Promise<IItem | null> {
    try {
      const item = await Item.findByPk(id);
      if (!item) {
        return null;
      }
      
      await item.update(itemData);
      const updatedItem = await Item.findByPk(id, {
        include: [
          {
            model: Brand,
            as: 'brand',
            attributes: ['id', 'name']
          }
        ]
      });
      return updatedItem ? updatedItem.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to update item with ID ${id}: ${error}`);
    }
  }

  // Delete item by ID
  static async delete(id: string): Promise<boolean> {
    try {
      const item = await Item.findByPk(id);
      if (!item) {
        return false;
      }
      
      await item.destroy();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete item with ID ${id}: ${error}`);
    }
  }

  // Check if item exists
  static async exists(id: string): Promise<boolean> {
    try {
      const item = await Item.findByPk(id);
      return !!item;
    } catch (error) {
      throw new Error(`Failed to check item existence with ID ${id}: ${error}`);
    }
  }

  // Find items by brand ID
  static async findByBrandId(brandId: string): Promise<IItem[]> {
    try {
      const items = await Item.findAll({
        where: { brand_id: brandId },
        include: [
          {
            model: Brand,
            as: 'brand',
            attributes: ['id', 'name']
          }
        ]
      });
      return items.map(item => item.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch items by brand ID ${brandId}: ${error}`);
    }
  }

  // Find items by model name (partial match)
  static async findByModelName(modelName: string): Promise<IItem[]> {
    try {
      const items = await Item.findAll({
        where: {
          model_name: {
            [Op.iLike]: `%${modelName}%`
          }
        },
        include: [
          {
            model: Brand,
            as: 'brand',
            attributes: ['id', 'name']
          }
        ]
      });
      return items.map(item => item.toJSON());
    } catch (error) {
      throw new Error(`Failed to search items by model name: ${error}`);
    }
  }

  // Check if model name exists (no error throwing)
  static async isModelNameExists(modelName: string): Promise<boolean> {
    try {
      const count = await Item.count({
        where: {
          model_name: {
            [Op.iLike]: `%${modelName}%`
          }
        }
      });
      return count > 0;
    } catch (error) {
      // Silently return false if there's an error
      return false;
    }
  }

  // Find items with pagination and search
  static async findWithPagination(
    page: number, 
    limit: number, 
    modelName?: string, 
    brandId?: string | string[]
  ): Promise<{
    items: IItem[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const offset = (page - 1) * limit;
      
      // Build where clause conditionally
      const whereClause: any = {};
      
      if (modelName) {
        whereClause.model_name = {
          [Op.like]: `%${modelName}%`,
        };
      }
      
      if (brandId) {
        // Handle both single brand_id and array of brand_ids
        const brandIds = Array.isArray(brandId) ? brandId : [brandId];
        whereClause.brand_id = {
          [Op.in]: brandIds,
        };
      }

      // Get total count with same filters
      const total = await Item.count({
        where: whereClause,
      });

      // Get items with pagination and optional filters
      const items = await Item.findAll({
        include: [
          {
            model: Brand,
            as: 'brand',
            attributes: ['name'],
          },
        ],
        where: whereClause,
        order: [['brand', 'name', 'ASC'], ['model_name', 'ASC']],
        limit,
        offset,
      });

      return {
        items: items.map(item => item.toJSON()),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new Error(`Failed to fetch items with pagination: ${error}`);
    }
  }

  // Check if brand exists
  static async checkBrandExists(brandId: string): Promise<boolean> {
    try {
      const brand = await Brand.findByPk(brandId);
      return !!brand;
    } catch (error) {
      throw new Error(`Failed to check brand existence: ${error}`);
    }
  }
}
