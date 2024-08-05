import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const { id, writer, message, type } = await req.json();

  try {
    await pool.query(`INSERT INTO comments (submission_id, writer, message, type) VALUES (?, ?, ?, ?)`, [
      id,
      writer,
      message,
      type,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export const POST = withAuth(handler);
