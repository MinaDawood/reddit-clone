import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import authRoutes from './routes/auth';
import trim from './middleware/trim';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());

app.get('/', (_, res) => res.send('GEt'));
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, async () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  try {
    await createConnection();
    console.log('Database connected');
  } catch (err) {
    console.log(err);
  }
});