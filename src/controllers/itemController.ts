import { Request, Response } from 'express';
import { Item, Brand } from '../models';
import { CreateItemDTO, UpdateItemDTO } from '../types';

// GET /api/items - Get all items with brand information
export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.findAll({
      include: [
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name'],
        },
      ],
    });
    res.json(items);
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
          attributes: ['id', 'name'],
        },
      ],
    });
    
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item', details: error });
  }
};

// POST /api/items - Create new item
/* Sample request body:
{
  "brand_id": 1,
  "model_name": "iPhone 15 Pro",
  "ram_gb": 8,
  "storage_gb": 256,
  "display_name": "iPhone 15 Pro 256GB"
}
*/
export const createItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const itemData: CreateItemDTO = req.body;
    
    // Verify brand exists
    const brand = await Brand.findByPk(itemData.brand_id);
    if (!brand) {
      res.status(400).json({ error: 'Brand not found' });
      return;
    }
    
    const item = await Item.create(itemData);
    const createdItem = await Item.findByPk(item.id, {
      include: [
        {
          model: Brand,
          as: 'brand',
          attributes: ['id', 'name'],
        },
      ],
    });
    
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create item', details: error });
  }
};

// PUT /api/items/:id - Update item
/* Sample request body:
{
  "brand_id": 1,
  "model_name": "iPhone 15 Pro Max",
  "ram_gb": 8,
  "storage_gb": 512,
  "display_name": "iPhone 15 Pro Max 512GB"
}
*/
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
          attributes: ['id', 'name'],
        },
      ],
    });
    
    res.json(updatedItem);
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
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item', details: error });
  }
};
