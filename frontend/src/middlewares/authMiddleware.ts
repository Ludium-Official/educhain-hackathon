import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.NEXT_PUBLIC_LUDIUM_SECRET_KEY || "";

export function withAuth(handler: Function) {
  return async (req: NextRequest) => {
    const apiKey = req.headers.get("x-api-key");

    if (apiKey === SECRET_KEY) {
      return handler(req);
    }

    return new NextResponse("Unauthorized", { status: 401 });
  };
}
