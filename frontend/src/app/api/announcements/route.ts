import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBAnnouncement } from '@/types/entities/announcement';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const { isDash, job } = await req.json();

  try {
    const query = isDash
      ? `SELECT * FROM announcements WHERE job = ? ORDER BY created_at LIMIT 6`
      : `SELECT * FROM announcements WHERE job = ?`;
    const [rows] = await pool.query(query, [job]);

    const announcements = rows as DBAnnouncement[];

    return NextResponse.json(announcements);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export const POST = withAuth(handler);
