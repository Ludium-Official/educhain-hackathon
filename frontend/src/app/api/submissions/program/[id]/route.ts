import { withAuth } from "@/middlewares/authMiddleware";

import { DBSubmission } from "@/types/entities/submission";
import { NextResponse } from "next/server";
import pool from "../../../db";

const handler = async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    const query = `SELECT * FROM submissions WHERE program_id = ?`;
    const [rows] = await pool.query(query, [id]);

    const request = rows as DBSubmission[];

    return NextResponse.json(request);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = withAuth(handler);
