export type MissionType = {
  id: number;
  validators: string;
  validator_address: string;
  owner: string | null;
  owner_name: string;
  program_id: number;
  is_confirm: 0 | 1;
  category: 'announcement' | 'study';
  title: string;
  content: string;
  missionCnt: number;
  reserve: string;
  prize: string;
  end_at: string;
  created_at: string;
};
