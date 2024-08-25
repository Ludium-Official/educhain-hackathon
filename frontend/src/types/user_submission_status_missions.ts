export type UserSubmissionStatusMissionsType = {
  id: number;
  title: string;
  missionCnt: number;
  prize: string;
  end_at: string;
  mission_id: number;
  program_id: number;
  submissionCount: number;
  signature: {
    id: number;
    sig?: string | null;
    is_claimed: number;
  };
};
