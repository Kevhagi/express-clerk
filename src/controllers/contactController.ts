import { Request, Response } from 'express';
import { Contact } from '../models';
import { CreateContactDTO, UpdateContactDTO } from '../types';

// GET /api/contacts - Get all contacts
export const getAllContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts', details: error });
  }
};

// GET /api/contacts/:id - Get contact by ID
export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);
    
    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact', details: error });
  }
};

// POST /api/contacts - Create new contact
/* Sample request body:
{
  "name": "ABC Supplier",
  "phone": "+1234567890"
}
*/
export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contactData: CreateContactDTO = req.body;
    const contact = await Contact.create(contactData);
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create contact', details: error });
  }
};

// PUT /api/contacts/:id - Update contact
/* Sample request body:
{
  "name": "XYZ Supplier",
  "phone": "+0987654321"
}
*/
export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateContactDTO = req.body;
    
    const [updatedRowsCount] = await Contact.update(updateData, {
      where: { id },
    });
    
    if (updatedRowsCount === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    const updatedContact = await Contact.findByPk(id);
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update contact', details: error });
  }
};

// DELETE /api/contacts/:id - Delete contact
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedRowsCount = await Contact.destroy({
      where: { id },
    });
    
    if (deletedRowsCount === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact', details: error });
  }
};
