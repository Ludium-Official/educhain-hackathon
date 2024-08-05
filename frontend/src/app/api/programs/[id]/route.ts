import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBProgram } from '@/types/entities/program';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  try {
    const query = `SELECT * FROM programs WHERE id = ?`;
    const [rows] = await pool.query(query, [id]);

    const request = rows as DBProgram[];

    return NextResponse.json(request[0]);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export const GET = withAuth(handler);
