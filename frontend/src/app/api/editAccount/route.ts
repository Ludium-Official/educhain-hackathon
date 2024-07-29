import { withAuth } from "@/middlewares/authMiddleware";

import { NextResponse } from "next/server";
import pool from "../db";

const handler = async (req: Request) => {
  const { walletId, name, number, introduce } = await req.json();

  try {
    const query = `
      UPDATE users
      SET
        name = ?,
        number = ?,
        introduce = ?
      WHERE
        walletId = ?
    `;

    await pool.query(query, [name, number, introduce, walletId]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = withAuth(handler);
