import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// A basic route to test
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// THIS IS THE KEY PART:
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});