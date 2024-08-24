import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { UserSubmissionStatusMissionsType } from '@/types/user_submission_status_missions';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const { walletId } = await req.json();

  try {
    connection = await pool.getConnection();

    const query = `
      SELECT
        m.id, m.title, m.missionCnt, m.prize, m.end_at, m.program_id, m.mission_id, COUNT(uss.id) submissionCount
      FROM
        user_submission_status uss
      JOIN
        missions m
      ON
        uss.mission_id = m.id
      WHERE
        uss.wallet_id = ?
      GROUP BY
        m.id, m.title, m.missionCnt;
    `;
    const [rows] = await connection.query(query, [walletId]);

    const request = rows as UserSubmissionStatusMissionsType[];

    return NextResponse.json(request);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
