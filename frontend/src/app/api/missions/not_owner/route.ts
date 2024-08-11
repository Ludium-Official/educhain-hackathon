import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBMission } from '@/types/entities/mission';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const { walletId } = await req.json();

  try {
    connection = await pool.getConnection();

    const query = `
      SELECT m.*
      FROM missions m
      LEFT JOIN user_submission_status uss 
      ON m.id = uss.mission_id 
      AND uss.wallet_id = ?
      WHERE uss.mission_id IS NULL
      AND (
          m.category = 'study' 
          OR (m.category = 'announcement' AND m.owner IS NULL)
      );
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
