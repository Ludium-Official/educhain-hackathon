import { NextApiRequest, NextApiResponse } from "next";

const SECRET_KEY = process.env.NEXT_PUBLIC_LUDIUM_SECRET_KEY || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const apiKey = req.headers["x-api-key"];

    if (apiKey === SECRET_KEY) {
      return res.status(200).json({ message: "This is a protected endpoint" });
    }

    return res.status(401).json({ error: "Unauthorized" });
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
