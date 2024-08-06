import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBCommunity } from '@/types/entities/community';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  try {
    connection = await pool.getConnection();

    const query = `
      SELECT 
        c.*, 
        u.name AS owner_name
      FROM 
        communities c
      JOIN
        users u
      ON
        c.owner = u.walletId
      WHERE
        c.id = ?
      `;
    const [rows] = await connection.query(query, [id]);

    const request = rows as DBCommunity[];

    return NextResponse.json(request[0]);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const GET = withAuth(handler);
