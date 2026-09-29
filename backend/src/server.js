require('dotenv').config();

const app = require('./app');
const pool = require('./config/database');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
