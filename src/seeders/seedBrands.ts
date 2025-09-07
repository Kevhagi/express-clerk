import { initDatabase, Brand } from '../models/index.js';

export const seedBrands = async () => {
  try {
    // Check if brands already exist
    const existingBrands = await Brand.count();
    if (existingBrands > 0) {
      console.log(`⚠️  Brands already exist (${existingBrands} found). Skipping brand seeding.`);
      return;
    }

    const brands = [
      { name: 'Apple' },
      { name: 'Samsung' },
      { name: 'Xiaomi' },
      { name: 'OPPO' },
      { name: 'Vivo' },
      { name: 'Realme' },
      { name: 'OnePlus' },
      { name: 'Google' },
      { name: 'Huawei' },
      { name: 'ASUS' },
      { name: 'Nokia' },
      { name: 'Motorola' },
      { name: 'Sony' },
      { name: 'LG' },
      { name: 'HTC' }
    ];

    await Brand.bulkCreate(brands);
    console.log(`✅ Created ${brands.length} brands successfully`);
  } catch (error) {
    console.error('❌ Error seeding brands:', error);
    throw error;
  }
};

// Export the function for use in other modules
export default seedBrands;
