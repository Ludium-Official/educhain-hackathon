import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const { missionData } = await req.json();

  try {
    connection = await pool.getConnection();

    console.log(missionData)
    await connection.query(
      `INSERT INTO missions (validators, owner, program_id, category, title, content, prize, end_at, reserve, validator_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        missionData.validators,
        missionData.owner,
        missionData.program_id,
        missionData.category,
        missionData.title,
        missionData.content,
        missionData.prize,
        missionData.end_at,
        missionData.reserve,
        missionData.validator_addresss
      ],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
