const express = require('express');
const db = require('./db');

const app = express();

app.get('/calls', async (req, res) => {

  const data = await db.query(
    'SELECT * FROM calls ORDER BY id DESC'
  );

  res.json(data.rows);
});

app.listen(3000, () => {
  console.log('API running on port 3000');
});
