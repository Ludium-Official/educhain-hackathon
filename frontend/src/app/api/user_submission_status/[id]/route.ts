import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { UserSubmissionListType } from '@/types/user_submission_list';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  try {
    connection = await pool.getConnection();

    const query = `
      SELECT
          u.name,
          uss.address,
          COUNT(DISTINCT uss.submission_id) AS submission_count,
          GROUP_CONCAT(DISTINCT s.sig) AS sig
      FROM
          user_submission_status uss
      LEFT JOIN
          signatures s
      ON
          uss.address = s.recipient
      LEFT JOIN
          users u
      ON
          uss.wallet_id = u.walletId
      WHERE
          uss.mission_id = ?
      GROUP BY
          uss.address, u.name`;
    const [rows] = await connection.query(query, [id]);

    const request = rows as UserSubmissionListType[];

    return NextResponse.json(request);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const GET = withAuth(handler);
