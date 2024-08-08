import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBChapter } from '@/types/entities/chapter';
import { DBUserSubmissionStatus } from '@/types/entities/user_submission_status';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  const { wallet_id } = await req.json();

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query('SELECT * FROM submissions WHERE mission_id = ?', [id]);
    const [submissionRow] = await connection.query(
      `SELECT submission_id FROM user_submission_status WHERE mission_id = ? AND wallet_id = ?`,
      [id, wallet_id],
    );

    const submissions = rows as DBChapter[];
    const userSubmissionStatus = submissionRow as DBUserSubmissionStatus[];

    const updatedMissions = submissions.map((submission) => {
      const isSubmitted = userSubmissionStatus.some((status) => status.submission_id === submission.id);
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
