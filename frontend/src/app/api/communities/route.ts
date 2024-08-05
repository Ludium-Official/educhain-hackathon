import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBCommunity } from '@/types/entities/community';
import { NextResponse } from 'next/server';

const handler = async () => {
  let connection;

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
      ORDER BY
        c.created_at DESC
    `;
    const [rows] = await connection.query(query);

    const communities = rows as DBCommunity[];

    return NextResponse.json(communities);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const GET = withAuth(handler);
