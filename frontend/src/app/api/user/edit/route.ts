import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const { walletId, name, number, introduce } = await req.json();

  try {
    connection = await pool.getConnection();

    const query = `
      UPDATE users
      SET
        name = ?,
        number = ?,
        introduce = ?
      WHERE
        walletId = ?
    `;

    await connection.query(query, [name, number, introduce, walletId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
