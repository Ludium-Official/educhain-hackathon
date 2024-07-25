import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const SECRET_KEY = process.env.NEXT_PUBLIC_LUDIUM_SECRET_KEY || "";

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const apiKey = req.headers["x-api-key"];

    if (apiKey === SECRET_KEY) {
      return handler(req, res);
    }

    return res.status(401).json({ error: "Unauthorized" });
  };
}
