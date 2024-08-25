import { DBMission } from './mission';

export type DBProgram = {
  id: number;
  owner: string;
  is_private: boolean;
  type: 'manage' | 'study';
  title: string;
  guide: string | null;
  prize: number;
  end_at: string;
  created_at: string;
  missions?: DBMission[];
  program_address: string;
};
