import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBUser } from '@/types/entities/user';
import { UserType } from '@/types/user';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const { addressKey } = await req.json();

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query('SELECT * FROM users WHERE walletId = ?', [addressKey]);

    const users = rows as DBUser[];

    const withoutId: UserType[] = users.map(({ id, ...rest }) => rest);

    return NextResponse.json(withoutId);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
