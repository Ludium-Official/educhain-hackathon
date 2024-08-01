import { withAuth } from "@/middlewares/authMiddleware";

import pool from "@/app/api/db";
import { DBChapter } from "@/types/entities/chapter";
import { NextResponse } from "next/server";

const handler = async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    const query = `SELECT * FROM chapters WHERE mission_id = ?`;
    const [rows] = await pool.query(query, [id]);

    const request = rows as DBChapter[];

    return NextResponse.json(request);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = withAuth(handler);
