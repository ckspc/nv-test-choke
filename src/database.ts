import { createConnection } from 'typeorm';

createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'nv_test_db',
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: true,
})
  .then(() => console.log('Connected to database'))
  .catch((error) => console.log('Database connection error: ', error));
