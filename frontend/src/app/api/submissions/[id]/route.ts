import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBSubmission } from '@/types/entities/submission';
import { DBUserSubmissionStatus } from '@/types/entities/user_submission_status';
import { NextResponse } from 'next/server';
import { isEmpty } from 'ramda';

const handler = async (req: Request) => {
  let connection;

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  const { wallet_id } = await req.json();

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query('SELECT * FROM submissions WHERE id = ?', [id]);
    const [submissionRow] = await connection.query(
      `SELECT id FROM user_submission_status WHERE submission_id = ? AND wallet_id = ?`,
      [id, wallet_id],
    );

    if (!rows) {
      return new NextResponse('Submission Not Found', { status: 404 });
    }

    const request = rows as DBSubmission[];
    const submissionRequest = submissionRow as DBUserSubmissionStatus[];
    const returnRequest = {
      ...request[0],
      submitStatus: !isEmpty(submissionRequest),
    };

    return NextResponse.json(returnRequest);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
