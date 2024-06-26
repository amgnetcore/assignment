const { Client } = require('@elastic/elasticsearch');

const client = new Client({ 
    node: 'http://localhost:9200' 
  });
  function isNumeric(str) {
    return /^\d+$/.test(str);
}

const removeDuplicates = (arr) => {
    const seen = new Set();
    return arr.filter(obj => {
      const key = obj.CompanyName + obj.id;
      return seen.has(key) ? false : seen.add(key);
    });
  };
async function search(value) {

    let intValue = parseInt(value, 10); 
    
    
   
    if (!isNaN(intValue)&&isNumeric(value)) {
        const result = await client.search({
            index: 'companies_index', 
            body: {
                query: {
                    term: {
                      id: intValue  
                    }
                  }
            }
          });
         
          const distinctCompanyNames = [...new Set(result.hits.hits.map(item => ({
           ... item._source,
          })))];
          const uniqueData = removeDuplicates(distinctCompanyNames);
         return uniqueData;

    } else {
        const result = await client.search({
            index: 'companies_index', 
            body: {
              query: {
                multi_match: { 
                    query: value,
                    fields: ['CompanyName', 'Email','CIN'] 
                }
              }
            }
          });
        
         
          const distinctCompanyNames = [...new Set(result.hits.hits.map(item => ({
            ... item._source,
          })))];
          const uniqueData = removeDuplicates(distinctCompanyNames);
          return uniqueData;
    }
 
 
}

module.exports = search;