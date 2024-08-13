import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { MissionStatusType } from '@/types/mission_status';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const { isDash, wallet_id } = await req.json();

  try {
    connection = await pool.getConnection();

    const defaultQuery = `
      SELECT 
        m.*,
        u.name AS owner_name,
        CASE
          WHEN COUNT(uss.mission_id) = 0 THEN 'not_start'
          WHEN COUNT(uss.mission_id) < m.missionCnt THEN 'going'
          WHEN COUNT(uss.mission_id) = m.missionCnt THEN 'done'
        END AS is_progress
      FROM 
        missions m
      LEFT JOIN 
        user_submission_status uss
      ON 
        m.id = uss.mission_id
    `;

    const andClause = wallet_id ? `AND uss.wallet_id = ?` : '';

    const queryWithConditions = `
      ${defaultQuery}
      ${andClause}
      LEFT JOIN 
        users u 
      ON 
        m.owner = u.walletId
      GROUP BY
        m.id, u.name
      ORDER BY m.created_at DESC
    `;

    const query = isDash ? `${queryWithConditions} LIMIT 6` : queryWithConditions;

    const [rows] = wallet_id ? await connection.query(query, [wallet_id]) : await connection.query(query);

    const programs = rows as MissionStatusType[];

    return NextResponse.json(programs);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
