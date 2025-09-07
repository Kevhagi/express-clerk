import { Router } from 'express';
import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js';

const router = Router();

// GET /api/brands - Get all brands
router.get('/', getAllBrands);

// GET /api/brands/:id - Get brand by ID
router.get('/:id', getBrandById);

// POST /api/brands - Create new brand
router.post('/', createBrand);

// PUT /api/brands/:id - Update brand
router.put('/:id', updateBrand);

// DELETE /api/brands/:id - Delete brand
router.delete('/:id', deleteBrand);

export default router;
