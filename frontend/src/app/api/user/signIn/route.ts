import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const { addressKey } = await req.json();

  try {
    connection = await pool.getConnection();

    await connection.query(`INSERT INTO users (walletId) VALUES (?)`, [addressKey]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
