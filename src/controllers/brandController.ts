import { Request, Response } from 'express';
import { Brand } from '../models';
import { CreateBrandDTO, UpdateBrandDTO } from '../types';

// GET /api/brands - Get all brands
export const getAllBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = (page - 1) * limit;

    // Get total count
    const total = await Brand.count();

    const brands = await Brand.findAll({
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    res.json({
      data: brands,
      total,
      page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brands', details: error });
  }
};

// GET /api/brands/:id - Get brand by ID
export const getBrandById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const brand = await Brand.findByPk(id);
    
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

    // TODO: Validate brandData before creating
    const brand = await Brand.create(brandData);
    const createdBrand = await Brand.findByPk(brand.dataValues.id);

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
    
    const [updatedRowsCount] = await Brand.update(updateData, {
      where: { id },
    });
    
    if (updatedRowsCount === 0) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }
    
    const updatedBrand = await Brand.findByPk(id);
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
    const deletedRowsCount = await Brand.destroy({
      where: { id },
    });
    
    if (deletedRowsCount === 0) {
      res.status(404).json({ error: 'Brand not found' });
      return;
    }
    
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete brand', details: error });
  }
};
