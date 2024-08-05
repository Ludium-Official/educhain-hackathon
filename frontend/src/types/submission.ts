export type SubmissionType = {
  id: number;
  program_id: number;
  mission_id: number;
  chapter_id: number;
  type: null | 'article' | 'mission';
  title: string;
  content: string;
  end_at: string;
  created_at: string;
};
