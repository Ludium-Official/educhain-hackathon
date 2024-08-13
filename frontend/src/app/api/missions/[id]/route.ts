import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBMission } from '@/types/entities/mission';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  try {
    connection = await pool.getConnection();

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
        m.id = ?
      AND
        m.is_confirm
      `;
    const [rows] = await connection.query(query, [id]);

    const request = rows as DBMission[];

    return NextResponse.json(request[0]);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const GET = withAuth(handler);
