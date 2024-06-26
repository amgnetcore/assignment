const elasticsearch = require('elasticsearch');


const knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'netcore',
    password: 'netcore@123',
    database: 'test'
  }
});

const elasticClient = new elasticsearch.Client({
    host: 'http://localhost:9200',
    log: 'trace' // Log level can be adjusted as needed
  });

async function migrateData() {
  try {
    // Query data from PostgreSQL
    const data = await knex.select('*').from('company');
    
    // Prepare bulkBody for Elasticsearch indexing
    const body = data.flatMap(doc => [
      { index: { _index: 'companies_index' } },
      doc
    ]);

    // Index data into Elasticsearch
    const { body: bulkResponse } = await elasticClient.bulk({ refresh: true, body });

    // Check for errors in bulk response
    if (bulkResponse.errors) {
      const erroredDocuments = [];
      // Analyze and log errors
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error.reason,
            operation: body[i * 2],
            document: body[i * 2 + 1]
          });
        }
      });
      console.log('Error indexing data:', erroredDocuments);
    } else {
      console.log('Data indexed successfully.');
    }

    // Optionally configure autocomplete/suggesters in Elasticsearch here

  } catch (error) {
    console.error('Error migrating data:', error);
  }
}

migrateData();
