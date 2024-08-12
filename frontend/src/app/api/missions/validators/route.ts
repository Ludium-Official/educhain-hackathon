import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBMission } from '@/types/entities/mission';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const { walletId } = await req.json();

  try {
    connection = await pool.getConnection();

    const query = `SELECT *
      FROM missions
      WHERE FIND_IN_SET(?, validators) > 0;
    `;
    const [rows] = await connection.query(query, [walletId]);

    const request = rows as DBMission[];

    return NextResponse.json(request);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
