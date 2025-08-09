import { Router } from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contactController';

const router = Router();

// GET /api/contacts - Get all contacts
router.get('/', getAllContacts);

// GET /api/contacts/:id - Get contact by ID
router.get('/:id', getContactById);

// POST /api/contacts - Create new contact
router.post('/', createContact);

// PUT /api/contacts/:id - Update contact
router.put('/:id', updateContact);

// DELETE /api/contacts/:id - Delete contact
router.delete('/:id', deleteContact);

export default router;
