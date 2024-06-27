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
    log: 'trace' 
  });

async function migrateData() {
  try {
   
    const data = await knex.select('*').from('company');
    
    
    const body = data.flatMap(doc => [
      { index: { _index: 'companies_index' } },
      doc
    ]);

    
    const { body: bulkResponse } = await elasticClient.bulk({ refresh: true, body });

    
    if (bulkResponse.errors) {
      const erroredDocuments = [];
      
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

   

  } catch (error) {
    console.error('Error migrating data:', error);
  }
}

migrateData();
