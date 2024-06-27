const knex = require('knex');

// Knex configuration for PostgreSQL
const knexConfig = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'netcore',
    password: 'netcore@123',
    database: 'test'
  }
};

// Function to create the company table
async function createTable() {
  const db = knex(knexConfig);

  try {
    await db.schema.createTable('company', function(table) {
      table.increments('id').primary(); // Auto-incrementing primary key 'id'
      table.string('CompanyName').notNullable();
      table.string('RoC').notNullable();
      table.string('CompanyStatus').notNullable();
      table.string('CompanyActivity').notNullable();
      table.string('CIN', 21).notNullable(); // Remove unique constraint
      table.date('RegistrationDate').notNullable();
      table.string('Category').notNullable();
      table.string('SubCategory').notNullable();
      table.string('CompanyClass').notNullable();
      table.integer('AuthorisedCapital').notNullable();
      table.integer('PaidUpCapital').notNullable();
      table.date('LastAnnualGeneralMeetingDate').nullable(); // Allow null values
      table.date('LatestDateOfBalanceSheet').nullable(); // Allow null values
      table.string('State').notNullable();
      table.string('PINCode', 6).notNullable();
      table.string('Country').notNullable();
      table.string('Address').notNullable();
      table.string('Email').nullable();
      table.string('ContactPerson').nullable();
      table.string('BusinessEmail').nullable();
      table.string('BusinessAddress').nullable();
      table.string('CompanyShortName').nullable();
    });

    console.log('Company table created successfully.');
  } catch (error) {
    console.error('Error creating company table:', error);
  } finally {
    await db.destroy(); 
  }
}

async function runMigration() {
  console.log('Creating company table...');
  await createTable();
  console.log('Migration completed.');
}

runMigration();