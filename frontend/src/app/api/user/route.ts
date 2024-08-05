import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBUser } from '@/types/entities/user';
import { UserType } from '@/types/user';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const { addressKey } = await req.json();

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE walletId = ?', [addressKey]);

    const users = rows as DBUser[];

    const withoutId: UserType[] = users.map(({ id, ...rest }) => rest);

    return NextResponse.json(withoutId);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};

export const POST = withAuth(handler);
