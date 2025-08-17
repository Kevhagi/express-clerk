import { Request, Response } from 'express';
import { Contact } from '../models';
import { CreateContactDTO, UpdateContactDTO } from '../types';
import { Op } from 'sequelize';

// GET /api/contacts - Get all contacts with pagination and search
export const getAllContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Optional search parameters
    const { name, phone } = req.query;

    // Build where clause conditionally
    const whereClause: any = {};
    
    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`,
      };
    }
    
    if (phone) {
      whereClause.phone = {
        [Op.like]: `%${phone}%`,
      };
    }

    // Get total count with same filters
    const total = await Contact.count({
      where: whereClause,
    });

    // Get contacts with pagination and optional filters
    const contacts = await Contact.findAll({
      where: whereClause,
      order: [['name', 'ASC']],
      limit,
      offset,
    });

    res.json({
      data: contacts,
      total,
      page,
      limit,
    });
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
    
    // Check for existing contact with same name
    const existingNameContact = await Contact.findOne({
      where: {
        name: contactData.name,
      },
    });
    
    if (existingNameContact) {
      res.status(409).json({ 
        error: 'Contact name already exists', 
        message: 'A contact with this name already exists',
        existingContact: {
          id: existingNameContact.dataValues.id,
          name: existingNameContact.dataValues.name,
          phone: existingNameContact.dataValues.phone,
        }
      });
      return;
    }
    
    // Check for existing contact with same phone number
    const existingPhoneContact = await Contact.findOne({
      where: {
        phone: contactData.phone,
      },
    });
    
    if (existingPhoneContact) {
      res.status(409).json({ 
        error: 'Phone number already exists', 
        message: 'A contact with this phone number already exists',
        existingContact: {
          id: existingPhoneContact.dataValues.id,
          name: existingPhoneContact.dataValues.name,
          phone: existingPhoneContact.dataValues.phone,
        }
      });
      return;
    }
    
    // Check for existing contact with same name and phone combination
    const existingNamePhoneContact = await Contact.findOne({
      where: {
        name: contactData.name,
        phone: contactData.phone,
      },
    });
    
    if (existingNamePhoneContact) {
      res.status(409).json({ 
        error: 'Contact already exists', 
        message: 'A contact with this name and phone number combination already exists',
        existingContact: {
          id: existingNamePhoneContact.dataValues.id,
          name: existingNamePhoneContact.dataValues.name,
          phone: existingNamePhoneContact.dataValues.phone,
        }
      });
      return;
    }
    
    const contact = await Contact.create(contactData);
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
    const currentContact = await Contact.findByPk(id);
    if (!currentContact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    // Check for duplicate name if name is being updated
    if (updateData.name && updateData.name !== currentContact.name) {
      const existingNameContact = await Contact.findOne({
        where: {
          name: updateData.name,
          id: { [Op.ne]: id }, // Exclude current contact from check
        },
      });
      
      if (existingNameContact) {
        res.status(409).json({ 
          error: 'Contact name already exists', 
          message: 'A contact with this name already exists',
          existingContact: {
            id: existingNameContact.dataValues.id,
            name: existingNameContact.dataValues.name,
            phone: existingNameContact.dataValues.phone,
          }
        });
        return;
      }
    }
    
    // Check for duplicate phone number if phone is being updated
    if (updateData.phone && updateData.phone !== currentContact.phone) {
      const existingPhoneContact = await Contact.findOne({
        where: {
          phone: updateData.phone,
          id: { [Op.ne]: id }, // Exclude current contact from check
        },
      });
      
      if (existingPhoneContact) {
        res.status(409).json({ 
          error: 'Phone number already exists', 
          message: 'A contact with this phone number already exists',
          existingContact: {
            id: existingPhoneContact.dataValues.id,
            name: existingPhoneContact.dataValues.name,
            phone: existingPhoneContact.dataValues.phone,
          }
        });
        return;
      }
    }
    
    // Check for duplicate name and phone combination if either is being updated
    if ((updateData.name && updateData.name !== currentContact.name) || 
        (updateData.phone && updateData.phone !== currentContact.phone)) {
      
      const existingNamePhoneContact = await Contact.findOne({
        where: {
          name: updateData.name || currentContact.name,
          phone: updateData.phone || currentContact.phone,
          id: { [Op.ne]: id }, // Exclude current contact from check
        },
      });
      
      if (existingNamePhoneContact) {
        res.status(409).json({ 
          error: 'Contact already exists', 
          message: 'A contact with this name and phone number combination already exists',
          existingContact: {
            id: existingNamePhoneContact.dataValues.id,
            name: existingNamePhoneContact.dataValues.name,
            phone: existingNamePhoneContact.dataValues.phone,
          }
        });
        return;
      }
    }
    
    const [updatedRowsCount] = await Contact.update(updateData, {
      where: { id },
    });
    
    if (updatedRowsCount === 0) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    const updatedContact = await Contact.findByPk(id);
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
    const existingContact = await Contact.findByPk(id);
    if (!existingContact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    
    // Delete the contact - this should succeed since we verified it exists
    await Contact.destroy({
      where: { id },
    });
    
    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    // If we reach here, there was an unexpected error during deletion
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact', details: error });
  }
};
