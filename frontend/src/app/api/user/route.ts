import { withAuth } from "@/middlewares/authMiddleware";

import { DBUser } from "@/types/user";
import { NextResponse } from "next/server";
import pool from "../db";

const handler = async (req: Request) => {
  const { addressKey } = await req.json();

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE walletId = ?", [
      addressKey,
    ]);

    const users = rows as DBUser[];

    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = withAuth(handler);
