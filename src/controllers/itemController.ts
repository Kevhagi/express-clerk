import { Request, Response } from 'express';
import { Item, Brand } from '../models';
import { CreateItemDTO, UpdateItemDTO } from '../types';
import { Op } from 'sequelize';

// GET /api/items - Get all items with brand information
export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Optional search parameters
    const { model_name, brand_id } = req.query;

    // Build where clause conditionally
    const whereClause: any = {};
    
    if (model_name) {
      whereClause.model_name = {
        [Op.like]: `%${model_name}%`,
      };
    }
    
    if (brand_id) {
      // Handle both single brand_id and array of brand_ids
      const brandIds = Array.isArray(brand_id) ? brand_id : [brand_id];
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

    res.json({
      data: items,
      total,
      page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items', details: error });
  }
};

// GET /api/items/:id - Get item by ID with brand information
export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id, {
      include: [
        {
          model: Brand,
          as: 'brand',
          attributes: ['name'],
        },
      ],
    });
    
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    
    res.json({
      data: item
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item', details: error });
  }
};

// POST /api/items - Create new item
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const itemData: CreateItemDTO = req.body;
    
    // Verify brand exists
    const brand = await Brand.findByPk(itemData.brand_id);
    if (!brand) {
      res.status(400).json({ error: 'Brand not found' });
      return;
    }
    
    // TODO: Validate itemData before creating
    const item = await Item.create(itemData);
    const createdItem = await Item.findByPk(item.dataValues.id, {
      include: [
        {
          model: Brand,
          as: 'brand',
          attributes: ['name'],
        },
      ],
    });
    
    res.status(201).json({
      data: createdItem
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create item', details: error });
  }
};

// PUT /api/items/:id - Update item
export const updateItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateItemDTO = req.body;
    
    // Verify brand exists if brand_id is being updated
    if (updateData.brand_id) {
      const brand = await Brand.findByPk(updateData.brand_id);
      if (!brand) {
        res.status(400).json({ error: 'Brand not found' });
        return;
      }
    }
    
    const [updatedRowsCount] = await Item.update(updateData, {
      where: { id },
    });
    
    if (updatedRowsCount === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    
    const updatedItem = await Item.findByPk(id, {
      include: [
        {
          model: Brand,
          as: 'brand',
          attributes: ['name'],
        },
      ],
    });
    
    res.json({
      data: updatedItem
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update item', details: error });
  }
};

// DELETE /api/items/:id - Delete item
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedRowsCount = await Item.destroy({
      where: { id },
    });
    
    if (deletedRowsCount === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item', details: error });
  }
};
