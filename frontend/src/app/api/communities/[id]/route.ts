import { withAuth } from "@/middlewares/authMiddleware";

import { DBCommunity } from "@/types/entities/community";
import { NextResponse } from "next/server";
import pool from "../../db";

const handler = async (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    const query = `
      SELECT 
        c.*, 
        u.name AS owner_name
      FROM 
        communities c
      JOIN
        users u
      ON
        c.owner = u.walletId
      WHERE
        c.id = ?
      `;
    const [rows] = await pool.query(query, [id]);

    const request = rows as DBCommunity[];

    return NextResponse.json(request[0]);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = withAuth(handler);
