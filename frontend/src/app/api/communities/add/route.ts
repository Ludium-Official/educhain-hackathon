import { withAuth } from "@/middlewares/authMiddleware";

import { NextResponse } from "next/server";
import pool from "../../db";

const handler = async (req: Request) => {
  const { auth, owner, title, content } = await req.json();

  if (auth !== 0) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    await pool.query(
      `INSERT INTO communities (owner, title, content) VALUES (?, ?, ?)`,
      [owner, title, content]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = withAuth(handler);
