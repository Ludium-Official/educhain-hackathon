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
      `INSERT INTO programs (owner, network, owner_address, type, title, guide, reserve, start_at, end_at) VALUES (?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?),FROM_UNIXTIME(?))`,
      [
        programData.owner,
        programData.chainId,
        programData.owner_address,
        programData.type,
        programData.title,
        programData.guide,
        programData.prize,
        programData.start_at,
        programData.end_at,
      ],
    );

    const managersPromise = programData.managers.map(async (manager: { address: string; name: string }) => {
      await connection.query(`INSERT INTO managers (program_id, memo, address) VALUES (?, ?, ?)`, [
        programResult.insertId,
        manager.name,
        manager.address,
      ]);
    });

    const missionInsertPromises = missionData.map(async (mission: MissionType, idx: number) => {
      await connection.query(
        `INSERT INTO missions (validators, owner, program_id, mission_id, category, title, content, reserve, prize, end_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?))`,
        [
          mission.validators,
          mission.owner,
          programResult.insertId,
          idx + 1,
          mission.category,
          mission.title,
          mission.content,
          mission.reserve,
          mission.prize,
          mission.end_at,
        ],
      );
    });

    await Promise.all([...managersPromise, ...missionInsertPromises]);

    await connection.commit();

    return NextResponse.json({ success: true, programId: programResult.insertId });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
