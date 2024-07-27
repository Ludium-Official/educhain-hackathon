import { withAuth } from "@/middlewares/authMiddleware";

import { DBAnnouncement } from "@/types/entities/announcement";
import { NextResponse } from "next/server";
import pool from "../db";

const handler = async (req: Request) => {
  const { isDash, job } = await req.json();

  try {
    const query = isDash
      ? `SELECT * FROM programs ORDER BY created_at LIMIT 6`
      : `SELECT * FROM programs`;
    const [rows] = await pool.query(query, [job]);

    const programs = rows as DBAnnouncement[];

    return NextResponse.json(programs);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = withAuth(handler);
