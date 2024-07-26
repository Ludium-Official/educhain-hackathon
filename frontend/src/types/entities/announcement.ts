export type DBAnnouncements = {
  id: number;
  owner: string;
  title: string;
  job: "manage" | "work";
  guide: string | null;
  end_at: string;
  created_at: string;
};
