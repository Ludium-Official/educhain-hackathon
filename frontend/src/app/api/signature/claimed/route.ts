import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const { programId, missionNumber, sigId, remain } = await req.json();
  let connection;

  try {
    connection = await pool.getConnection();

    const updateSig = `UPDATE signatures SET is_claimed = 1 WHERE id = ?`;
    await connection.query<import('mysql2').ResultSetHeader>(updateSig, [sigId]);

    const updateReserve = `UPDATE missions SET reserve = ? WHERE program_id = ? AND mission_id = ?`;
    await connection.query<import('mysql2').ResultSetHeader>(updateReserve, [remain, programId, missionNumber]);

    return NextResponse.json({ programId, missionNumber, remain });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
