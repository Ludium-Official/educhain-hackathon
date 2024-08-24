import { withAuth } from '@/middlewares/authMiddleware';
import { keccak256 } from 'viem';

import pool from '@/app/api/db';
import { MissionType } from '@/types/mission';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const { sigData } = await req.json();

  const connection = await pool.getConnection();

  try {
    await connection.query<import('mysql2').ResultSetHeader>(
      `UPDATE signatures SET sig = ? WHERE program_id = ? AND mission_id = ? AND recipient = ?`,
      [sigData.sig, sigData.programId, sigData.missionId, sigData.recipient],
    );

    return NextResponse.json({ success: true, sigId: sigData.id });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
