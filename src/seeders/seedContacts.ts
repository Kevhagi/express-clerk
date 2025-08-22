import { Contact } from '../models';

export const seedContacts = async () => {
  try {
    // Check if contacts already exist
    const existingContacts = await Contact.count();
    if (existingContacts > 0) {
      console.log(`⚠️  Contacts already exist (${existingContacts} found). Skipping contact seeding.`);
      return;
    }

    const contacts = [
      { 
        name: 'John Smith',
        phone: '+6281234567890'
      },
      { 
        name: 'Sarah Johnson',
        phone: '+6282345678901'
      },
      { 
        name: 'Michael Chen',
        phone: '+6283456789012'
      },
      { 
        name: 'Emily Davis',
        phone: '+6284567890123'
      },
      { 
        name: 'David Wilson',
        phone: '+6285678901234'
      }
    ];

    await Contact.bulkCreate(contacts);
    console.log(`✅ Created ${contacts.length} contacts successfully`);
  } catch (error) {
    console.error('❌ Error seeding contacts:', error);
    throw error;
  }
};

// Export the function for use in other modules
export default seedContacts;
