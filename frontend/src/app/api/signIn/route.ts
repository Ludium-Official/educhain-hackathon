import { withAuth } from "@/middlewares/authMiddleware";

import { NextResponse } from "next/server";
import pool from "../db";

const handler = async (req: Request) => {
  const { addressKey } = await req.json();

  try {
    await pool.query(`INSERT INTO users (walletId) VALUES (?)`, [addressKey]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = withAuth(handler);
