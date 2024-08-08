import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  const { submission, wallet_id } = await req.json();
  const { program_id, mission_id, chapter_id } = submission;

  try {
    connection = await pool.getConnection();

    await connection.query(
      `INSERT INTO user_submission_status (program_id, mission_id, chapter_id, submission_id, wallet_id) VALUES (?, ?, ?, ?, ?)`,
      [program_id, mission_id, chapter_id, id, wallet_id],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
