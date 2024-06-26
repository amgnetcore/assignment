const express = require('express');
const bodyParser = require('body-parser');
const search = require('./search')
const knex = require('knex');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

const knexConfig = {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'netcore',
      password: 'netcore@123',
      database: 'test'
    }
  };
const db = knex(knexConfig);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes

// GET /clients/ - List all clients
app.get('/clients/', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number, default: 1
    const limit = parseInt(req.query.limit) || 10; // Number of records per page, default: 10
    const offset = (page - 1) * limit; // Offset calculation
  
    try {
      // Query to fetch paginated clients
      const clients = await db('company')
        .select('*')
        .limit(limit)
        .offset(offset);
  
      // Query to count total number of clients (for pagination info)
      const totalCountQuery = await db('company').count('* as total').first();
      const totalCount = parseInt(totalCountQuery.total);
  
      const totalPages = Math.ceil(totalCount / limit); // Calculate total pages
  
      res.json({
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        clients: clients
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve clients' });
    }
});

// POST /clients/ - Create a new client
app.post('/clients/', async (req, res) => {
  try {
    const newClient = await db('company').insert(req.body);
    res.json(newClient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create new client' });
  }
});

// GET /clients/:id - Show one client
app.get('/clients/:id', async (req, res) => {
  const clientId = req.params.id;
  try {
    const client = await db('company').where({ id: clientId }).first();
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve client' });
  }
});

// POST /clients/:id - Update a client
app.post('/clients/:id', async (req, res) => {
  const clientId = req.params.id;
  try {
    const updatedClient = await db('company').where({ id: clientId }).update(req.body);
    if (!updatedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// DELETE /clients/:id - Delete a client
app.delete('/clients/:id', async (req, res) => {
  const clientId = req.params.id;
  try {
    const deletedClient = await db('company').where({ id: clientId }).del();
    if (!deletedClient) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete client' });
  }
});
app.get('/search', async (req, res) => {
    const value = req.query.value; // Assuming 'value' is the search parameter
    try {
        const searchResults = await search(value); // Call your search function
        res.json(searchResults);
    } catch (error) {
        console.error('Error in search:', error);
        res.status(500).json({ error: 'Failed to perform search' });
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
