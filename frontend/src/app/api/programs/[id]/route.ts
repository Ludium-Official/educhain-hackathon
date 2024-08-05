import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBProgram } from '@/types/entities/program';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  try {
    connection = await pool.getConnection();

    const query = `SELECT * FROM programs WHERE id = ?`;
    const [rows] = await connection.query(query, [id]);

    const request = rows as DBProgram[];

    return NextResponse.json(request[0]);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const GET = withAuth(handler);
