// bulkInsert.js

const knex = require('knex');
const companyData = require('./companyData');

// Knex configuration for PostgreSQL

const moment = require('moment');

// Knex configuration for PostgreSQL


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

// Sample data for bulk insertion (replace this with your actual data)

async function bulkInsert() {
    const db = knex(knexConfig);
    const batchSize = 500; // Adjust batch size as needed
  
    try {
      // Convert AuthorisedCapital and PaidUpCapital from string to integer and convert dates to proper format
      const formattedCompanyData = companyData.map(company => {
        let authorisedCapital = parseInt(company["Authorised Capital"], 10);
        let paidUpCapital = parseInt(company["Paid Up Capital"], 10);
  
        // Set default values for invalid Authorised Capital and Paid Up Capital
        if (isNaN(authorisedCapital)) {
          authorisedCapital = 0; // Default value
          console.error(`Invalid integer value for Authorised Capital in record: ${company["Company Name"]}`);
          console.log(`Authorised Capital: ${company["Authorised Capital"]}, Paid Up Capital: ${company["Paid Up Capital"]}`);
        }
  
        if (isNaN(paidUpCapital)) {
          paidUpCapital = 0; // Default value
          console.error(`Invalid integer value for Paid Up Capital in record: ${company["Company Name"]}`);
          console.log(`Authorised Capital: ${authorisedCapital}, Paid Up Capital: ${company["Paid Up Capital"]}`);
        }
  
        // Parse dates and set default values for invalid dates
        let registrationDate = moment(company["Registration Date"], 'DD-MMM-YYYY').isValid() ? moment(company["Registration Date"], 'DD-MMM-YYYY').format('YYYY-MM-DD') : '1970-01-01';
        let lastAGMDate = company["Last Annual General Meeting Date"] ? (moment(company["Last Annual General Meeting Date"], 'DD-MMM-YYYY').isValid() ? moment(company["Last Annual General Meeting Date"], 'DD-MMM-YYYY').format('YYYY-MM-DD') : '1970-01-01') : '1970-01-01';
        let balanceSheetDate = company["Latest Date of Balance Sheet"] ? (moment(company["Latest Date of Balance Sheet"], 'DD-MMM-YYYY').isValid() ? moment(company["Latest Date of Balance Sheet"], 'DD-MMM-YYYY').format('YYYY-MM-DD') : '1970-01-01') : '1970-01-01';
  
        // Log invalid date values
        if (registrationDate === '1970-01-01') {
          console.error(`Invalid date value for Registration Date in record: ${company["Company Name"]}`);
          console.log(`Registration Date: ${company["Registration Date"]}`);
        }
        if (lastAGMDate === '1970-01-01' && company["Last Annual General Meeting Date"]) {
          console.error(`Invalid date value for Last Annual General Meeting Date in record: ${company["Company Name"]}`);
          console.log(`Last Annual General Meeting Date: ${company["Last Annual General Meeting Date"]}`);
        }
        if (balanceSheetDate === '1970-01-01' && company["Latest Date of Balance Sheet"]) {
          console.error(`Invalid date value for Latest Date of Balance Sheet in record: ${company["Company Name"]}`);
          console.log(`Latest Date of Balance Sheet: ${company["Latest Date of Balance Sheet"]}`);
        }
  
        return {
          CompanyName: company["Company Name"] || 'Unknown',
          RoC: company["RoC"] || 'Unknown',
          CompanyStatus: company["Company Status"] || 'Unknown',
          CompanyActivity: company["Company Activity"] || 'Unknown',
          CIN: company["CIN"] || 'Unknown',
          RegistrationDate: registrationDate,
          Category: company["Category"] || 'Unknown',
          SubCategory: company["Sub Category"] || 'Unknown',
          CompanyClass: company["Company Class"] || 'Unknown',
          AuthorisedCapital: authorisedCapital,
          PaidUpCapital: paidUpCapital,
          LastAnnualGeneralMeetingDate: lastAGMDate,
          LatestDateOfBalanceSheet: balanceSheetDate,
          State: company["State"] || 'Unknown',
          PINCode: company["PIN Code"] || '000000',
          Country: company["Country"] || 'Unknown',
          Address: company["Address"] || 'Unknown',
          Email: company["Email"] || 'unknown@example.com',
          ContactPerson: company["Contact Person"] || 'Unknown',
          BusinessEmail: company["Business Email"] || 'unknown@example.com',
          BusinessAddress: company["Business Address"] || 'Unknown',
          CompanyShortName: company["Company Short Name"] || 'Unknown'
        };
      });
  
      for (let i = 0; i < formattedCompanyData.length; i += batchSize) {
        const batch = formattedCompanyData.slice(i, i + batchSize);
        await db.batchInsert('company', batch, batchSize);
        console.log(`Inserted batch ${i / batchSize + 1}`);
      }
  
      console.log('Bulk insert process completed.');
    } catch (error) {
      console.error('Error inserting data:', error);
    } finally {
      await db.destroy(); // Close the database connection
    }
  }
  
  // Run the bulkInsert function
  bulkInsert();