import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBSignature } from '@/types/entities/signature';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const { programId, missionNumber, sigId, remain } = await req.json();
  let connection;

  try {
    connection = await pool.getConnection();

    const deleteSig = `DELETE FROM signatures WHERE id = ?`;
    await connection.query<import('mysql2').ResultSetHeader>(deleteSig, [sigId]);

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
