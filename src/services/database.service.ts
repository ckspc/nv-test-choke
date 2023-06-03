// database.service.ts
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(private readonly connection: Connection) {}

  async testConnection(): Promise<void> {
    try {
      await this.connection.query('SELECT 1');
      console.log('Database connection established successfully!');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
    }
  }
}
