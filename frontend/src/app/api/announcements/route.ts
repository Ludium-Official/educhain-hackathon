import { withAuth } from "@/middlewares/authMiddleware";

import { DBAnnouncements } from "@/types/entities/announcement";
import { NextResponse } from "next/server";
import pool from "../db";

const handler = async (req: Request) => {
  const { isDash, job } = await req.json();

  try {
    const query = isDash
      ? `SELECT * FROM announcements WHERE job = '${job}' ORDER BY created_at LIMIT 6`
      : `SELECT * FROM announcements WHERE job = '${job}'`;
    const [rows] = await pool.query(query);

    const announcements = rows as DBAnnouncements[];

    return NextResponse.json(announcements);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = withAuth(handler);
