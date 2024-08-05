import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBMission } from '@/types/entities/mission';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  try {
    const query = `
      SELECT 
        m.*, 
        u.name AS owner_name
      FROM 
        missions m
      LEFT JOIN
        users u
      ON
        m.owner = u.walletId
      WHERE
        m.program_id = ?
      `;
    const [rows] = await pool.query(query, [id]);

    const request = rows as DBMission[];

    return NextResponse.json(request);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export const GET = withAuth(handler);
