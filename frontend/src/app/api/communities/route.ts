import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBCommunity } from '@/types/entities/community';
import { NextResponse } from 'next/server';

const handler = async () => {
  try {
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
    const [rows] = await pool.query(query);

    const communities = rows as DBCommunity[];

    return NextResponse.json(communities);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export const GET = withAuth(handler);
