import { withAuth } from "@/middlewares/authMiddleware";

import { DBComment } from "@/types/entities/comment";
import { NextResponse } from "next/server";
import pool from "../../db";

const handler = async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  const { type } = await req.json();

  try {
    const query = `
      SELECT 
        c.*, 
        u.name AS name
      FROM 
        comments c
      JOIN 
        users u
      ON 
        c.writer = u.walletId
      WHERE
        type = ?
      AND
        submission_id = ?
      ORDER BY
        created_at DESC;
    `;

    const [rows] = await pool.query(query, [type, id]);

    const programs = rows as DBComment[];

    return NextResponse.json(programs);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = withAuth(handler);
