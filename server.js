const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Create a MySQL connection
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Sharan@11',
//     database: 'classroom_locator'
// });
const connection = mysql.createConnection({
    host: 'sql12.freemysqlhosting.net',
    user: 'sql12725005',
    password: '69mtMQaSa5',
    database: 'classroom_locator',
    port: 3306 // Ensure the port number is specified
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL server.');
});

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// Search Endpoint
app.post('/search', (req, res) => {
    const { query } = req.body;

    if (!query) {
        console.error('No query parameter provided');
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    console.log(`Received search query: ${query}`);

    // Define queries - lower() is to standardize
    
    const searchByNameQuery = `
        SELECT cc.room_code, cn.room_name, cc.block, cc.floor
        FROM classroom_code cc
        LEFT JOIN classroom_name cn ON cc.room_code = cn.room_code
        WHERE LOWER(cn.room_name) LIKE LOWER(?)`;

    const searchByCodeQuery = `
        SELECT cc.room_code, cn.room_name, cc.block, cc.floor
        FROM classroom_code cc
        LEFT JOIN classroom_name cn ON cc.room_code = cn.room_code
        WHERE LOWER(cc.room_code) LIKE LOWER(?)`;

    connection.query(
        searchByNameQuery,
        [`%${query}%`],
        (err, results) => {
            if (err) {
                console.error('Error executing searchByNameQuery:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            console.log('Results from searchByNameQuery:', results);

            if (results.length === 0) {
                // If no results found by room_name, try searching by room_code with LIKE
                connection.query(
                    searchByCodeQuery,
                    [`%${query}%`],
                    (err, codeResults) => {
                        if (err) {
                            console.error('Error executing searchByCodeQuery:', err);
                            return res.status(500).json({ error: 'Internal server error' });
                        }

                        console.log('Results from searchByCodeQuery:', codeResults);
                        res.json(codeResults);
                    }
                );
            } else {
                res.json(results);
            }
        }
    );
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
