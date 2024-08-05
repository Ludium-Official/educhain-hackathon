import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBAnnouncement } from '@/types/entities/announcement';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  try {
    const [rows] = await pool.query('SELECT * FROM announcements WHERE id = ?', [id]);

    const announcements = rows as DBAnnouncement[];

    return NextResponse.json(announcements[0]);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export const GET = withAuth(handler);
