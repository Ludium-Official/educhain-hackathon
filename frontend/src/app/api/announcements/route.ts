import { withAuth } from "@/middlewares/authMiddleware";

import { DBAnnouncements } from "@/types/entities/announcement";
import { NextResponse } from "next/server";
import pool from "../db";

const handler = async (req: Request) => {
  const { isDash } = await req.json();

  try {
    const [rows] = await pool.query(
      `SELECT * FROM announcements ${isDash && `ORDER BY created_at LIMIT 6`}`
    );

    const announcements = rows as DBAnnouncements[];

    return NextResponse.json(announcements);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = withAuth(handler);
