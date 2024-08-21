import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { DBProgram } from '@/types/entities/program';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const { isDash, walletId, isConfirm } = await req.json();

  try {
    connection = await pool.getConnection();

    const defaultQuery = `
      SELECT 
        p.*,
        CASE 
          WHEN COUNT(m.id) = 0 THEN NULL
          ELSE COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', m.id,
                'owner', m.owner,
                'category', m.category,
                'title', m.title,
                'created_at', m.created_at,
                'is_confirm', m.is_confirm,
                'reserve', m.reserve
              )
            ),
          JSON_ARRAY())
        END AS missions
      FROM 
        programs p
      LEFT JOIN 
        missions m ON p.id = m.program_id
        ${isConfirm ? '' : 'AND m.is_confirm'}
    `;

    const whereClause = walletId ? `WHERE p.owner = ?` : '';

    const queryWithConditions = `
      ${defaultQuery}
      ${whereClause}
      GROUP BY 
        p.id, p.owner, p.is_private, p.type, p.title, p.guide, p.reserve, p.end_at, p.created_at
      ORDER BY p.created_at DESC
    `;

    const query = isDash ? `${queryWithConditions} LIMIT 6` : queryWithConditions;

    const [rows] = walletId ? await connection.query(query, [walletId]) : await connection.query(query);

    const programs = rows as DBProgram[];

    return NextResponse.json(programs);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
