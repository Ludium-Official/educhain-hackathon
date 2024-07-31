import { withAuth } from "@/middlewares/authMiddleware";

import { DBProgram } from "@/types/entities/program";
import { NextResponse } from "next/server";
import pool from "../db";

const handler = async (req: Request) => {
  const { isDash, job } = await req.json();

  try {
    const defaultQuery = `SELECT 
      p.*,
      COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', m.id,
            'owner', m.owner,
            'category', m.category,
            'title', m.title,
            'created_at', m.created_at
          )
        ),
      JSON_ARRAY()
    ) AS missions
    FROM 
      programs p
    LEFT JOIN 
      missions m ON p.id = m.program_id
    GROUP BY 
      p.id, p.owner, p.is_private, p.type, p.title, p.guide, p.prize, p.end_at, p.created_at`;
    const query = isDash
      ? `${defaultQuery} ORDER BY p.created_at LIMIT 6`
      : `${defaultQuery}`;
    const [rows] = await pool.query(query, [job]);

    const programs = rows as DBProgram[];

    return NextResponse.json(programs);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = withAuth(handler);
