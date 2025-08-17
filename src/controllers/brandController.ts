import { Request, Response } from 'express';
import { BrandService } from '../services';
import { CreateBrandDTO, UpdateBrandDTO } from '../types';

// GET /api/brands - Get all brands
export const getAllBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = (page - 1) * limit;

    const result = await BrandService.findWithPagination(page, limit);

    res.json({
      data: result.brands,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brands', details: error });
  }
};

// GET /api/brands/:id - Get brand by ID
export const getBrandById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const brand = await BrandService.findById(id);
    
    if (!brand) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }
    
    res.json({
      data: brand
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brand', details: error });
  }
};

// POST /api/brands - Create new brand
/* Sample request body:
{
  "name": "Apple"
}
*/
export const createBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const brandData: CreateBrandDTO = req.body;

    const createdBrand = await BrandService.create(brandData);

    res.status(201).json({
      data: createdBrand
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create brand', details: error });
  }
};

// PUT /api/brands/:id - Update brand
/* Sample request body:
{
  "name": "Samsung"
}
*/
export const updateBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateBrandDTO = req.body;
    
    const updatedBrand = await BrandService.update(id, updateData);
    if (!updatedBrand) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }
    
    res.json({
      data: updatedBrand
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update brand', details: error });
  }
};

// DELETE /api/brands/:id - Delete brand
export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if brand exists before attempting to delete
    const existingBrand = await BrandService.findById(id);
    if (!existingBrand) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }
    
    // Delete brand using service
    const deleted = await BrandService.delete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }
    
    res.status(200).json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete brand', details: error });
  }
};
