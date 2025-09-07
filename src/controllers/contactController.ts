import { Request, Response } from 'express';
import { ContactService } from '../services/index.js';
import { CreateContactDTO, UpdateContactDTO } from '../types/index.js';

// GET /api/contacts - Get all contacts with pagination and search
export const getAllContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { name, phone } = req.query;

    const result = await ContactService.findWithPagination(
      page, 
      limit, 
      name as string, 
      phone as string
    );

    res.json({
      data: result.contacts,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts', details: error });
  }
};

// GET /api/contacts/:id - Get contact by ID
export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const contact = await ContactService.findById(id);
    
    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    res.json({
      data: contact
    });
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
    
    // Check for duplicates using service
    const duplicateCheck = await ContactService.checkForDuplicates(contactData);
    
    if (duplicateCheck.hasNameDuplicate) {
      res.status(409).json({ 
        error: 'Contact name already exists', 
        message: 'A contact with this name already exists',
        existingContact: duplicateCheck.existingContacts.name
      });
      return;
    }
    
    if (duplicateCheck.hasPhoneDuplicate) {
      res.status(409).json({ 
        error: 'Phone number already exists', 
        message: 'A contact with this phone number already exists',
        existingContact: duplicateCheck.existingContacts.phone
      });
      return;
    }
    
    if (duplicateCheck.hasCombinationDuplicate) {
      res.status(409).json({ 
        error: 'Contact already exists', 
        message: 'A contact with this name and phone number combination already exists',
        existingContact: duplicateCheck.existingContacts.combination
      });
      return;
    }
    
    const contact = await ContactService.create(contactData, req.clerkId!);
    res.status(201).json({
      data: contact
    });
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
    
    // Get the current contact to compare with updates
    const currentContact = await ContactService.findById(id);
    if (!currentContact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    // Check for duplicates using service (excluding current contact)
    const duplicateCheck = await ContactService.checkForDuplicates(updateData, id);
    
    if (updateData.name && updateData.name !== currentContact.name && duplicateCheck.hasNameDuplicate) {
      res.status(409).json({ 
        error: 'Contact name already exists', 
        message: 'A contact with this name already exists',
        existingContact: duplicateCheck.existingContacts.name
      });
      return;
    }
    
    if (updateData.phone && updateData.phone !== currentContact.phone && duplicateCheck.hasPhoneDuplicate) {
      res.status(409).json({ 
        error: 'Phone number already exists', 
        message: 'A contact with this phone number already exists',
        existingContact: duplicateCheck.existingContacts.phone
      });
      return;
    }
    
    if (((updateData.name && updateData.name !== currentContact.name) || 
         (updateData.phone && updateData.phone !== currentContact.phone)) && 
        duplicateCheck.hasCombinationDuplicate) {
      res.status(409).json({ 
        error: 'Contact already exists', 
        message: 'A contact with this name and phone number combination already exists',
        existingContact: duplicateCheck.existingContacts.combination
      });
      return;
    }
    
    const updatedContact = await ContactService.update(id, updateData, req.clerkId!);
    if (!updatedContact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    res.json({
      data: updatedContact
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update contact', details: error });
  }
};

// DELETE /api/contacts/:id - Delete contact
export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Check if contact exists before attempting to delete
    const existingContact = await ContactService.findById(id);
    if (!existingContact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    // Delete the contact using service
    const deleted = await ContactService.delete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    // If we reach here, there was an unexpected error during deletion
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact', details: error });
  }
};
