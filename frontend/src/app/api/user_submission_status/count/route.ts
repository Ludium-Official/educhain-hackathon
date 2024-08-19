import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { UserCountType } from '@/types/user_count';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const { walletId } = await req.json();

  try {
    connection = await pool.getConnection();

    const query = `
      SELECT
        COUNT(DISTINCT uss.wallet_id) AS user_count
      FROM
        user_submission_status uss
      JOIN
        programs p
      ON
        uss.program_id = p.id
      WHERE
        p.owner= ?;
    `;
    const [rows] = await connection.query(query, [walletId]);

    const request = rows as UserCountType[];

    return NextResponse.json(request[0]);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
