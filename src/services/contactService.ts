import { Contact } from '../models';
import { CreateContactDTO, UpdateContactDTO, IContact } from '../types';
import { Op } from 'sequelize';

export class ContactService {
  // Create a new contact
  static async create(contactData: CreateContactDTO, clerkId: string): Promise<IContact> {
    try {
      const contact = await Contact.create({
        ...contactData,
        created_by: clerkId,
        updated_by: clerkId
      });
      return contact.toJSON();
    } catch (error) {
      throw new Error(`Failed to create contact: ${error}`);
    }
  }

  // Get all contacts
  static async findAll(): Promise<IContact[]> {
    try {
      const contacts = await Contact.findAll();
      return contacts.map(contact => contact.toJSON());
    } catch (error) {
      throw new Error(`Failed to fetch contacts: ${error}`);
    }
  }

  // Get contact by ID
  static async findById(id: string): Promise<IContact | null> {
    try {
      const contact = await Contact.findByPk(id);
      return contact ? contact.toJSON() : null;
    } catch (error) {
      throw new Error(`Failed to fetch contact with ID ${id}: ${error}`);
    }
  }

  // Update contact by ID
  static async update(id: string, contactData: UpdateContactDTO, clerkId: string): Promise<IContact | null> {
    try {
      const contact = await Contact.findByPk(id);
      if (!contact) {
        return null;
      }
      
      await contact.update({
        ...contactData,
        updated_by: clerkId
      });
      return contact.toJSON();
    } catch (error) {
      throw new Error(`Failed to update contact with ID ${id}: ${error}`);
    }
  }

  // Delete contact by ID
  static async delete(id: string): Promise<boolean> {
    try {
      const contact = await Contact.findByPk(id);
      if (!contact) {
        return false;
      }
      
      await contact.destroy();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete contact with ID ${id}: ${error}`);
    }
  }

  // Check if contact exists
  static async exists(id: string): Promise<boolean> {
    try {
      const contact = await Contact.findByPk(id);
      return !!contact;
    } catch (error) {
      throw new Error(`Failed to check contact existence with ID ${id}: ${error}`);
    }
  }

  // Find contacts by name (partial match)
  static async findByName(name: string): Promise<IContact[]> {
    try {
      const contacts = await Contact.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`
          }
        }
      });
      return contacts.map(contact => contact.toJSON());
    } catch (error) {
      throw new Error(`Failed to search contacts by name: ${error}`);
    }
  }

  // Find contacts with pagination and search
  static async findWithPagination(page: number, limit: number, name?: string, phone?: string): Promise<{
    contacts: IContact[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const offset = (page - 1) * limit;
      
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

      return {
        contacts: contacts.map(contact => contact.toJSON()),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new Error(`Failed to fetch contacts with pagination: ${error}`);
    }
  }

  // Check for duplicate contact (name, phone, or combination)
  static async checkForDuplicates(contactData: CreateContactDTO | UpdateContactDTO, excludeId?: string): Promise<{
    hasNameDuplicate: boolean;
    hasPhoneDuplicate: boolean;
    hasCombinationDuplicate: boolean;
    existingContacts: {
      name?: IContact;
      phone?: IContact;
      combination?: IContact;
    };
  }> {
    try {
      const whereClause: any = {};
      if (excludeId) {
        whereClause.id = { [Op.ne]: excludeId };
      }

      // Check for name duplicate (only if name is provided)
      let nameDuplicate = null;
      if (contactData.name) {
        nameDuplicate = await Contact.findOne({
          where: { ...whereClause, name: contactData.name },
        });
      }

      // Check for phone duplicate (only if phone is provided)
      let phoneDuplicate = null;
      if (contactData.phone) {
        phoneDuplicate = await Contact.findOne({
          where: { ...whereClause, phone: contactData.phone },
        });
      }

      // Check for combination duplicate (only if both name and phone are provided)
      let combinationDuplicate = null;
      if (contactData.name && contactData.phone) {
        combinationDuplicate = await Contact.findOne({
          where: { ...whereClause, name: contactData.name, phone: contactData.phone },
        });
      }

      return {
        hasNameDuplicate: !!nameDuplicate,
        hasPhoneDuplicate: !!phoneDuplicate,
        hasCombinationDuplicate: !!combinationDuplicate,
        existingContacts: {
          name: nameDuplicate ? nameDuplicate.toJSON() : undefined,
          phone: phoneDuplicate ? phoneDuplicate.toJSON() : undefined,
          combination: combinationDuplicate ? combinationDuplicate.toJSON() : undefined,
        },
      };
    } catch (error) {
      throw new Error(`Failed to check for duplicates: ${error}`);
    }
  }
}
