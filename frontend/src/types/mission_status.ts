import { MissionType } from './mission';

export interface MissionStatusType extends MissionType {
  owner_name: string;
  is_progress: 'not_start' | 'going' | 'done';
}
