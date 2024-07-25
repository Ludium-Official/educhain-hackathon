import { withAuth } from "@/middlewares/authMiddleware";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ message: "Hello, world!" });
};

export default withAuth(handler);
