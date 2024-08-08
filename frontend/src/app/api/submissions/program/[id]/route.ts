import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBSubmission } from '@/types/entities/submission';
import { DBUserSubmissionStatus } from '@/types/entities/user_submission_status';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  const { wallet_id } = await req.json();

  try {
    connection = await pool.getConnection();

    const [submissionRows] = await connection.query('SELECT * FROM submissions WHERE program_id = ?', [id]);
    const [userSubmissionStatusRows] = await connection.query(
      `SELECT submission_id FROM user_submission_status WHERE program_id = ? AND wallet_id = ?`,
      [id, wallet_id],
    );

    if (!submissionRows) {
      return new NextResponse('Submission Not Found', { status: 404 });
    }

    const submissionRquest = submissionRows as DBSubmission[];
    const userStateRequest = userSubmissionStatusRows as DBUserSubmissionStatus[];
    const updatedMissions = submissionRquest.map((submission) => {
      const isSubmitted = userStateRequest.some((status) => status.submission_id === submission.id);
      return { ...submission, submitStatus: isSubmitted };
    });

    return NextResponse.json(updatedMissions);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
