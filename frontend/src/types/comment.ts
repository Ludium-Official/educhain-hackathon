export type CommentType = {
  id: number;
  submission_id: string;
  name: string;
  writer: string;
  message: string;
  type: "community" | "submission";
  created_at: string;
};
