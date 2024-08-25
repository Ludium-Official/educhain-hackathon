import { DBMission } from './entities/mission';

export type ProgramType = {
  id: number;
  owner: string;
  is_private: boolean;
  type: 'manage' | 'study';
  title: string;
  guide: string | null;
  reserve: string;
  end_at: string | null;
  created_at: string;
  missions?: DBMission[];
  owner_address: string;
  program_address: string;
};
