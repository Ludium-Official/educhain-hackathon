import { withAuth } from '@/middlewares/authMiddleware';
import { keccak256 } from 'viem';

import pool from '@/app/api/db';
import { MissionType } from '@/types/mission';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const { sigData } = await req.json();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [signatureResult] = await connection.query<import('mysql2').ResultSetHeader>(
      `INSERT INTO signatures (program_id, mission_id, recipient, validator, prize, sig, sig_hash) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        sigData.programId,
        sigData.missionId,
        sigData.recipient,
        sigData.validator,
        sigData.prize,
        sigData.sig,
        keccak256(sigData.sig),
      ],
    );
    await connection.commit();

    return NextResponse.json({ success: true, sigId: signatureResult.insertId });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
