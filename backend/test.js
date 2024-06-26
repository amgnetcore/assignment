const knex = require('knex')({
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'netcore',
      password: 'netcore@123',
      database: 'test'
    }
  });
  
  knex.select('*')
    .from('company_data')
    .where('CIN', 'U37200MP2023PTC064465')
    .then(rows => {
      console.log(rows);
    })
    .catch(err => {
      console.error(err);
    })
    .finally(() => {
      knex.destroy();
    });
  