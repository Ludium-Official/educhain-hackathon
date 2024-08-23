import { withAuth } from '@/middlewares/authMiddleware';

import pool from '@/app/api/db';
import { NextResponse } from 'next/server';

const handler = async (req: Request) => {
  let connection;

  const url = new URL(req.url);
  const id = url.pathname.split('/')[3];

  const { chapterData, submissionData } = await req.json();
  const { program_id, submissions } = submissionData;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let chapterId = 0;

    if (chapterData) {
      const [chapterResult] = await connection.query(
        `INSERT INTO chapters (program_id, mission_id, title) VALUES (?, ?, ?)`,
        [program_id, id, chapterData.title],
      );
      chapterId = (chapterResult as { insertId: number }).insertId;
    }

    for (const submission of submissions) {
      await connection.query(
        `INSERT INTO submissions (program_id, mission_id, chapter_id, type, title, content, end_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          program_id,
          id,
          chapterId || 0,
          chapterId ? submission.type : null,
          submission.title,
          submission.content,
          submission.endTime,
        ],
      );
    }

    await connection.query(`UPDATE missions SET missionCnt = missionCnt + ? WHERE id = ?`, [submissions.length, id]);

    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    if (connection) connection.release();
  }
};

export const POST = withAuth(handler);
