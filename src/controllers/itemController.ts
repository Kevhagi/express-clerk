import { Request, Response } from 'express';
import { ItemService } from '../services';
import { CreateItemDTO, UpdateItemDTO } from '../types';

// GET /api/items - Get all items with brand information
export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { model_name, brand_id } = req.query;

    const result = await ItemService.findWithPagination(
      page, 
      limit, 
      model_name as string, 
      brand_id as string | string[]
    );

    res.json({
      data: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items', details: error });
  }
};

// GET /api/items/:id - Get item by ID with brand information
export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await ItemService.findById(id);
    
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
    
    // Verify brand exists using service
    const brandExists = await ItemService.checkBrandExists(itemData.brand_id);
    if (!brandExists) {
      res.status(400).json({ error: 'Brand not found' });
      return;
    }
    
    // Create item using service
    const createdItem = await ItemService.create(itemData);
    
    // Get the created item with brand information
    const itemWithBrand = await ItemService.findById(createdItem.id!);
    
    res.status(201).json({
      data: itemWithBrand
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
      const brandExists = await ItemService.checkBrandExists(updateData.brand_id);
      if (!brandExists) {
        res.status(400).json({ error: 'Brand not found' });
        return;
      }
    }
    
    // Update item using service
    const updatedItem = await ItemService.update(id, updateData);
    if (!updatedItem) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    
    // Get the updated item with brand information
    const itemWithBrand = await ItemService.findById(id);
    
    res.json({
      data: itemWithBrand
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update item', details: error });
  }
};

// DELETE /api/items/:id - Delete item
export const deleteItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if item exists before attempting to delete
    const existingItem = await ItemService.findById(id);
    if (!existingItem) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    
    // Delete item using service
    const deleted = await ItemService.delete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item', details: error });
  }
};
