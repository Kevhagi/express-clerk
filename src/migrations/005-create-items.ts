import { DataTypes, QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) => {
  await queryInterface.createTable('items', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    brand_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'brands', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    model_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ram_gb: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    storage_gb: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    display_name: {
      type: DataTypes.STRING,
      allowNull: false // auto-filled by trigger
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  // Function to auto-update display_name
  await queryInterface.sequelize.query(`
    CREATE OR REPLACE FUNCTION update_display_name()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.display_name := trim(
        (SELECT name FROM brands WHERE brands.id = NEW.brand_id) || ' ' ||
        NEW.model_name || ' ' ||
        COALESCE(NEW.ram_gb::text || 'GB/', '') ||
        CASE 
          WHEN NEW.storage_gb >= 1024 THEN (NEW.storage_gb / 1024)::text || 'TB'
          ELSE NEW.storage_gb::text || 'GB'
        END
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Trigger for display_name updates
  await queryInterface.sequelize.query(`
    CREATE TRIGGER trg_update_display_name
    BEFORE INSERT OR UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION update_display_name();
  `);

  // Optional: Auto-update `updated_at`
  await queryInterface.sequelize.query(`
    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await queryInterface.sequelize.query(`
    CREATE TRIGGER trg_set_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
  `);
};

export const down = async (queryInterface: QueryInterface) => {
  await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS trg_update_display_name ON items;`);
  await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS update_display_name();`);
  await queryInterface.sequelize.query(`DROP TRIGGER IF EXISTS trg_set_updated_at ON items;`);
  await queryInterface.sequelize.query(`DROP FUNCTION IF EXISTS set_updated_at();`);
  await queryInterface.dropTable('items');
};
