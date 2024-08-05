import { getDatabaseConfig } from '@/functions/database-function';
import mysql from 'mysql2/promise';

const dbConfig = getDatabaseConfig();

const pool = mysql.createPool(dbConfig);

export default pool;
