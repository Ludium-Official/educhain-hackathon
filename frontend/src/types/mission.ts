export type MissionType = {
  id: number;
  validators: string;
  owner: string | null;
  owner_name: string;
  program_id: number;
  category: 'announcement' | 'study';
  title: string;
  content: string;
  missionCnt: number;
  prize: number;
  end_at: string;
  created_at: string;
};
