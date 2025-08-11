import { Contact } from '../models';
import { CreateContactDTO, UpdateContactDTO, IContact } from '../types';

export class ContactService {
  // Create a new contact
  static async create(contactData: CreateContactDTO): Promise<IContact> {
    try {
      const contact = await Contact.create(contactData);
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
  static async update(id: string, contactData: UpdateContactDTO): Promise<IContact | null> {
    try {
      const contact = await Contact.findByPk(id);
      if (!contact) {
        return null;
      }
      
      await contact.update(contactData);
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
            [require('sequelize').Op.iLike]: `%${name}%`
          }
        }
      });
      return contacts.map(contact => contact.toJSON());
    } catch (error) {
      throw new Error(`Failed to search contacts by name: ${error}`);
    }
  }
}
