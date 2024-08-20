import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { MissionType } from '@/types/mission';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  const { programData, missionData } = await req.json();

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [programResult] = await connection.query<import('mysql2').ResultSetHeader>(
      `INSERT INTO programs (owner, type, title, guide, prize, end_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        programData.owner,
        programData.type,
        programData.title,
        programData.guide,
        programData.prize,
        programData.end_at,
      ],
    );

    const missionInsertPromises = missionData.map(async (mission: MissionType, idx: number) => {
      await connection.query(
        `INSERT INTO missions (validators, owner, program_id, mission_id, category, title, content, prize, end_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          mission.validators,
          mission.owner,
          programResult.insertId,
          idx + 1,
          mission.category,
          mission.title,
          mission.content,
          mission.prize,
          mission.end_at,
        ],
      );
    });

    await Promise.all(missionInsertPromises);

    await connection.commit();

    return NextResponse.json({ success: true, programId: programResult.insertId });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
