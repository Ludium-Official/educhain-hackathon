import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { NextResponse } from 'next/server';

interface ConfirmMissionCount {
  confirmedCount: number;
}

const handler = async (req: Request) => {
  let connection;

  const { id, program_id } = await req.json();

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query(
      `SELECT COUNT(missions.id) AS confirmedCount FROM missions WHERE is_confirm = 1 AND program_id = ?;`,
      [program_id],
    );

    const request = rows as ConfirmMissionCount[];
    const confirmedCount = request[0]?.confirmedCount || 0;
    const updatedConfirmedCount = confirmedCount + 1;

    await connection.query(`UPDATE missions SET is_confirm = 1, mission_id = ? WHERE id = ?;`, [
      updatedConfirmedCount,
      id,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
