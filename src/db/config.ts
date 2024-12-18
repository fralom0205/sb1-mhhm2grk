import Dexie from 'dexie';
import { dbSchema, dbVersion } from './schema';
import { Database } from '../types/database';

class AppDatabase extends Dexie implements Database {
  constructor() {
    super('universitybox_db');
    this.version(dbVersion).stores(dbSchema);
  }
}

export const db = new AppDatabase();