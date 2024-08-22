import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { MissionType } from '@/types/mission';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const { programId, programAddress } = await req.json();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Update program_address for the specified program
    const [updateResult] = await connection.query<import('mysql2').ResultSetHeader>(
      `UPDATE programs SET program_address = ? WHERE id = ?`,
      [programAddress, programId],
    );

    await connection.commit();

    if (updateResult.affectedRows === 0) {
      return new NextResponse('Program not found', { status: 404 });
    }

    return NextResponse.json({ success: true, updatedProgramId: programId });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating program:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
