import { Brand, Item } from '../models';

export const seedItems = async () => {
  try {
    // Check if items already exist
    const existingItems = await Item.count();
    if (existingItems > 0) {
      console.log(`⚠️  Items already exist (${existingItems} found). Skipping item seeding.`);
      return;
    }

    // Fetch existing brands with explicit field selection
    console.log('📱 Fetching existing brands...');
    const createdBrands: { [key: string]: string } = {};
    
    const allBrands = await Brand.findAll({
      attributes: ['id', 'name'], // Explicitly select only id and name fields,
      raw: true,
    });
    
    console.log(`📊 Found ${allBrands.length} brands in database`);
    
    for (const brand of allBrands) {
      // Debug: log the raw brand object
      console.log(`🔍 Raw brand object:`, JSON.stringify(brand, null, 2));
      
      if (brand.name && brand.id) {
        createdBrands[brand.name] = brand.id;
        console.log(`✅ Found brand: ${brand.name} (ID: ${brand.id})`);
      } else {
        console.error(`❌ Invalid brand data:`, brand.toJSON());
      }
    }

    // Check if we have any valid brands
    if (Object.keys(createdBrands).length === 0) {
      throw new Error('No valid brands found in database. Please seed brands first.');
    }

    console.log(`📋 Available brands: ${Object.keys(createdBrands).join(', ')}`);

    // Sample item data
    const items = [
    // Apple iPhones
    {
      brand_name: 'Apple',
      model_name: 'iPhone 15 Pro Max',
      ram_gb: 8,
      storage_gb: 256,
    },
    {
      brand_name: 'Apple',
      model_name: 'iPhone 15 Pro',
      ram_gb: 8,
      storage_gb: 128,
    },
    {
      brand_name: 'Apple',
      model_name: 'iPhone 15',
      ram_gb: 6,
      storage_gb: 128,
    },
    {
      brand_name: 'Apple',
      model_name: 'iPhone 14 Pro',
      ram_gb: 6,
      storage_gb: 256,
    },

    // Samsung Galaxy
    {
      brand_name: 'Samsung',
      model_name: 'Galaxy S24 Ultra',
      ram_gb: 12,
      storage_gb: 256,
    },
    {
      brand_name: 'Samsung',
      model_name: 'Galaxy S24+',
      ram_gb: 12,
      storage_gb: 256,
    },
    {
      brand_name: 'Samsung',
      model_name: 'Galaxy S24',
      ram_gb: 8,
      storage_gb: 128,
    },
    {
      brand_name: 'Samsung',
      model_name: 'Galaxy A55',
      ram_gb: 8,
      storage_gb: 128,
    },

    // Xiaomi
    {
      brand_name: 'Xiaomi',
      model_name: 'Redmi Note 13 Pro+',
      ram_gb: 12,
      storage_gb: 256,
    },
    {
      brand_name: 'Xiaomi',
      model_name: 'POCO X6 Pro',
      ram_gb: 12,
      storage_gb: 512,
    },
    {
      brand_name: 'Xiaomi',
      model_name: 'Redmi 13C',
      ram_gb: 8,
      storage_gb: 256,
    },

    // OPPO
    {
      brand_name: 'OPPO',
      model_name: 'Find X7 Ultra',
      ram_gb: 16,
      storage_gb: 512,
    },
    {
      brand_name: 'OPPO',
      model_name: 'Reno 11 Pro',
      ram_gb: 12,
      storage_gb: 256,
    },
    {
      brand_name: 'OPPO',
      model_name: 'A98',
      ram_gb: 8,
      storage_gb: 128,
    },

    // Vivo
    {
      brand_name: 'Vivo',
      model_name: 'X100 Pro',
      ram_gb: 16,
      storage_gb: 512,
    },
    {
      brand_name: 'Vivo',
      model_name: 'V29',
      ram_gb: 12,
      storage_gb: 256,
    },
    {
      brand_name: 'Vivo',
      model_name: 'Y27',
      ram_gb: 8,
      storage_gb: 128,
    },

    // Realme
    {
      brand_name: 'Realme',
      model_name: 'GT Neo 5 SE',
      ram_gb: 16,
      storage_gb: 1,
    },
    {
      brand_name: 'Realme',
      model_name: '11 Pro+',
      ram_gb: 12,
      storage_gb: 512,
    },
    {
      brand_name: 'Realme',
      model_name: 'C67',
      ram_gb: 8,
      storage_gb: 256,
    },

    // OnePlus
    {
      brand_name: 'OnePlus',
      model_name: '12',
      ram_gb: 16,
      storage_gb: 512,
    },
    {
      brand_name: 'OnePlus',
      model_name: '11',
      ram_gb: 16,
      storage_gb: 256,
    },
    {
      brand_name: 'OnePlus',
      model_name: 'Nord CE 3',
      ram_gb: 8,
      storage_gb: 128,
    },

    // Google
    {
      brand_name: 'Google',
      model_name: 'Pixel 8 Pro',
      ram_gb: 12,
      storage_gb: 256,
    },
    {
      brand_name: 'Google',
      model_name: 'Pixel 8',
      ram_gb: 8,
      storage_gb: 128,
    },
    {
      brand_name: 'Google',
      model_name: 'Pixel 7a',
      ram_gb: 8,
      storage_gb: 128,
    },

    // ASUS
    {
      brand_name: 'ASUS',
      model_name: 'ROG Phone 8',
      ram_gb: 16,
      storage_gb: 512,
    },
    {
      brand_name: 'ASUS',
      model_name: 'ZenFone 10',
      ram_gb: 16,
      storage_gb: 256,
    },

    // Nokia
    {
      brand_name: 'Nokia',
      model_name: 'G42',
      ram_gb: 6,
      storage_gb: 128,
    },
    {
      brand_name: 'Nokia',
      model_name: 'C32',
      ram_gb: 4,
      storage_gb: 64,
    },

    // Motorola
    {
      brand_name: 'Motorola',
      model_name: 'Edge 40',
      ram_gb: 8,
      storage_gb: 256,
    },
    {
      brand_name: 'Motorola',
      model_name: 'G84',
      ram_gb: 12,
      storage_gb: 256,
    }
  ];

    // Prepare items data with brand IDs
    const itemsToCreate = items.map(itemData => {
      const brandName = itemData.brand_name;
      const brandId = createdBrands[brandName];
      
      if (!brandId) {
        console.error(`❌ Brand not found: ${brandName}`);
        console.error(`Available brands: ${Object.keys(createdBrands).join(', ')}`);
        throw new Error(`Brand not found: ${brandName}. Available brands: ${Object.keys(createdBrands).join(', ')}`);
      }
      
      return {
        brand_id: brandId,
        model_name: itemData.model_name,
        ram_gb: itemData.ram_gb,
        storage_gb: itemData.storage_gb,
        created_by: 'system',
        updated_by: 'system'
      };
    });

    await Item.bulkCreate(itemsToCreate);
    console.log(`✅ Created ${items.length} items successfully`);
  } catch (error) {
    console.error('❌ Error seeding items:', error);
    throw error;
  }
};

// Export the function for use in other modules
export default seedItems;