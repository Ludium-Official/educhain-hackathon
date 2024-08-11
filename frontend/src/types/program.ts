import { DBMission } from './entities/mission';

export type ProgramType = {
  id: number;
  owner: string;
  is_private: boolean;
  type: 'manage' | 'study';
  title: string;
  guide: string | null;
  prize: number;
  end_at: string | null;
  created_at: string;
  missions?: DBMission[];
};
