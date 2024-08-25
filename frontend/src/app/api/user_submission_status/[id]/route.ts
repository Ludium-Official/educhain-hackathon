import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { Signature } from '@/types/signature';
import { UserSubmissionListType } from '@/types/user_submission_list';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  const { program_id, mission_id } = await req.json();

  try {
    connection = await pool.getConnection();

    const query = `
      SELECT
          u.name,
          uss.address,
          COUNT(DISTINCT uss.submission_id) AS submission_count
      FROM
          user_submission_status uss
      LEFT JOIN
          users u
      ON
          uss.wallet_id = u.walletId
      WHERE
          uss.mission_id = ?
      GROUP BY
          uss.address, u.name`;
    const [rows] = await connection.query(query, [id]);
    const [signaturesRows] = await connection.query(
      'SELECT * FROM signatures WHERE program_id = ? AND mission_id = ?',
      [program_id, mission_id],
    );

    const users = rows as UserSubmissionListType[];
    const signatures = signaturesRows as Signature[];

    const combined = users.map((user) => {
      const submission = signatures.find((sub) => sub.recipient.toLowerCase() === user.address.toLowerCase());
      return {
        ...user,
        sig: submission?.sig,
        is_claimed: submission?.is_claimed,
      };
    }) as UserSubmissionListType[];

    return NextResponse.json(combined);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
